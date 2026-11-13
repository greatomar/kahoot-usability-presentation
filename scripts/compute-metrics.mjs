#!/usr/bin/env node
/**
 * Data layer — single source of truth.
 * Reads data/*.json, derives every metric used by BOTH the HTML deck and the PPTX deck.
 * Empty study in, empty-state metrics out. No fabricated numbers anywhere.
 *
 * Usage: node scripts/compute-metrics.mjs   → writes src/data/metrics.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = process.env.KAHOOT_DATA_DIR ?? join(root, 'data');
const load = (name) => JSON.parse(readFileSync(join(dataDir, name), 'utf8'));

export const GROUPS = [
  { id: 'highschool', labelAr: 'طلاب الثانوية', labelEn: 'High School Students' },
  { id: 'middle', labelAr: 'طلاب المتوسط', labelEn: 'Middle School Students' },
];

export function susScore(responses) {
  // Standard SUS: odd items → response − 1, even items → 5 − response; sum × 2.5 (0–100)
  let sum = 0;
  for (let i = 1; i <= 10; i++) {
    const v = responses[`q${i}`];
    if (typeof v !== 'number' || v < 1 || v > 5) return null;
    sum += i % 2 === 1 ? v - 1 : 5 - v;
  }
  return Math.round(sum * 2.5 * 10) / 10;
}

export function computeMetrics() {
  const participants = load('participants.json');
  const tasks = load('tasks.json').sort((a, b) => a.order - b.order);
  const observations = load('observations.json');
  const susResponses = load('sus-responses.json');
  const feedback = load('feedback.json');

  const groupOf = (pid) => participants.find((p) => p.participant_id === pid)?.group ?? null;

  const perTask = tasks.map((t) => {
    const row = {
      task_id: t.task_id,
      order: t.order,
      name_ar: t.task_name,
      name_en: t.task_name_en,
      description: t.task_description ?? '',
      scenario: t.scenario ?? '',
      steps: Array.isArray(t.steps) ? t.steps : [],
      measure: t.measure ?? '',
      standard_time_seconds: t.standard_time_seconds ?? null,
      groups: {},
    };
    for (const g of GROUPS) {
      const obs = observations.filter(
        (o) => o.task_id === t.task_id && groupOf(o.participant_id) === g.id
      );
      const completed = obs.filter((o) => o.completion_status === 'completed');
      const times = completed.map((o) => o.actual_time_seconds).filter((v) => typeof v === 'number');
      row.groups[g.id] = {
        attempts: obs.length,
        completed: completed.length,
        incomplete: obs.length - completed.length,
        completion_rate: obs.length ? Math.round((completed.length / obs.length) * 1000) / 10 : null,
        avg_actual_time_seconds: times.length
          ? Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 10) / 10
          : null,
        total_errors: obs.reduce((a, o) => a + (o.error_count ?? 0), 0),
        assistance_count: obs.filter((o) => o.assistance_required === true).length,
      };
    }
    return row;
  });

  const perGroup = {};
  for (const g of GROUPS) {
    const members = participants.filter((p) => p.group === g.id);
    const ids = new Set(members.map((p) => p.participant_id));
    const obs = observations.filter((o) => ids.has(o.participant_id));
    const totalErrors = obs.reduce((a, o) => a + (o.error_count ?? 0), 0);
    const completed = obs.filter((o) => o.completion_status === 'completed').length;
    const ages = members.map((p) => p.age).filter((v) => typeof v === 'number');
    perGroup[g.id] = {
      participant_count: members.length,
      age_min: ages.length ? Math.min(...ages) : null,
      age_max: ages.length ? Math.max(...ages) : null,
      avg_age: ages.length ? Math.round((ages.reduce((a, b) => a + b, 0) / ages.length) * 10) / 10 : null,
      total_errors: obs.length ? totalErrors : null,
      avg_errors_per_participant: members.length && obs.length
        ? Math.round((totalErrors / members.length) * 10) / 10
        : null,
      tasks_completed: obs.length ? completed : null,
      tasks_incomplete: obs.length ? obs.length - completed : null,
      completion_rate: obs.length ? Math.round((completed / obs.length) * 1000) / 10 : null,
    };
  }

  const totalTimePerParticipant = participants.map((p) => {
    const times = observations
      .filter((o) => o.participant_id === p.participant_id && typeof o.actual_time_seconds === 'number')
      .map((o) => o.actual_time_seconds);
    return {
      participant_id: p.participant_id,
      group: p.group,
      total_time_seconds: times.length ? Math.round(times.reduce((a, b) => a + b, 0) * 10) / 10 : null,
    };
  });

  const susPerParticipant = susResponses.map((r) => ({
    participant_id: r.participant_id,
    group: groupOf(r.participant_id),
    score: r.calculated_sus_score ?? susScore(r),
  }));
  const validScores = susPerParticipant.filter((s) => typeof s.score === 'number');
  const avg = (arr) => (arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null);
  const sus = {
    overall: avg(validScores.map((s) => s.score)),
    highschool: avg(validScores.filter((s) => s.group === 'highschool').map((s) => s.score)),
    middle: avg(validScores.filter((s) => s.group === 'middle').map((s) => s.score)),
    responses: validScores.length,
  };

  const susById = new Map(susPerParticipant.map((s) => [s.participant_id, s.score]));
  const participantResults = participants.map((p) => {
    const rows = tasks.map((t) => {
      const o = observations.find((o) => o.participant_id === p.participant_id && o.task_id === t.task_id);
      return {
        task_id: t.task_id,
        time_seconds: o?.actual_time_seconds ?? null,
        completion_status: o?.completion_status ?? null,
        error_count: o?.error_count ?? 0,
        assistance_required: o?.assistance_required ?? false,
      };
    });
    return {
      participant_id: p.participant_id,
      group: p.group,
      age: p.age ?? null,
      tasks: rows,
      total_errors: rows.reduce((a, r) => a + r.error_count, 0),
      sus: susById.get(p.participant_id) ?? null,
    };
  });

  const errorDescriptions = {};
  for (const o of observations) {
    const d = (o.error_description ?? '').trim();
    if (d) errorDescriptions[d] = (errorDescriptions[d] ?? 0) + 1;
  }

  const hasData = {
    participants: participants.length > 0,
    observations: observations.length > 0,
    standard_times: tasks.some((t) => typeof t.standard_time_seconds === 'number'),
    sus: validScores.length > 0,
    feedback: feedback.length > 0,
    errors: observations.some((o) => (o.error_count ?? 0) > 0),
  };

  return {
    generated_at: new Date().toISOString(),
    study_status: hasData.observations ? 'data_collected' : 'awaiting_real_test_data',
    hasData,
    groups: GROUPS,
    tasks: perTask,
    perGroup,
    totalTimePerParticipant,
    participantResults,
    sus,
    topErrorTypes: Object.entries(errorDescriptions)
      .sort((a, b) => b[1] - a[1])
      .map(([description, count]) => ({ description, count })),
    feedback: feedback.map((f) => ({
      participant_id: f.participant_id,
      group: groupOf(f.participant_id),
      positive: f.positive_feedback ?? null,
      negative: f.negative_feedback ?? null,
      suggestions: f.improvement_suggestions ?? null,
    })),
  };
}

if (process.argv[1] && process.argv[1].endsWith('compute-metrics.mjs')) {
  const metrics = computeMetrics();
  const out = join(root, 'src', 'data', 'metrics.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(metrics, null, 2));
  console.log(`metrics → ${out}  (status: ${metrics.study_status})`);
}
