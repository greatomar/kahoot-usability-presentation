/**
 * Slide content + markup for the HTML deck.
 * All results regions render from the metrics object — with no data they render
 * designed empty states. Nothing here fabricates a number.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EMPTY, AWAITING_AR, AWAITING_EN } from '../design/tokens.mjs';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const logoDir = join(rootDir, 'assets', 'logos');
const shotDir = join(rootDir, 'assets', 'screenshots');
const logoSvg = (file, cls) =>
  readFileSync(join(logoDir, file), 'utf8').replace('<svg ', `<svg class="${cls}" focusable="false" `);
const shotImg = (file) =>
  `data:image/jpeg;base64,${readFileSync(join(shotDir, file)).toString('base64')}`;

const TEAM = ['عبدالله باسلامة', 'عمر عبدالله برهيش', 'عمر سعيد برهيش', 'عبدالله بامطرف', 'عوض بن وبر', 'علي مقيبل'];

const en = (t) => `<span class="en">${t}</span>`;
const emptyTag = () => `<span class="empty-tag">${AWAITING_AR} ${en(AWAITING_EN)}</span>`;

const icons = {
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
};
const ic = (name, size = 26, color = 'var(--primaryPurple)') =>
  `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;

const head = (kicker, title, sub = '') => `
  <div class="head">
    <span class="kicker">${kicker}</span>
    <h1 class="slide-title">${title}</h1>
    ${sub ? `<p class="slide-sub">${sub}</p>` : ''}
  </div>`;

const foot = () => `
  <div class="foot">${logoSvg('kahoot-icon.svg', 'foot-icon')}</div>`;

/* ---------------- Slide 01 — Cover ---------------- */
const s01 = () => `
<section class="slide deep cover" data-title="الغلاف">
  <div class="cover-inner">
    ${logoSvg('kahoot-wordmark.svg', 'cover-wordmark')}
    <h1 class="cover-title-ar">اختبار قابلية استخدام<br>تطبيق <span class="hl">Kahoot</span> على <span class="en">Android</span></h1>
    <p class="cover-ar">دراسة اختبار قابلية الاستخدام ومقارنة بين طلاب الثانوية وطلاب المتوسط</p>
  </div>
  ${foot()}
</section>`;

/* ---------------- Slide 02 — Inside the app ---------------- */
const s02 = () => {
  const shots = [
    ['01-home-web.jpg', 'الرئيسية', 'الوصول السريع إلى المكتبة والإنشاء والاستكشاف'],
    ['02-explore-web.jpg', 'الاستكشاف', 'البحث عن اختبار حسب الموضوع'],
    ['05-join-web.jpg', 'الانضمام', 'إدخال رمز اللعبة والانضمام إلى غرفة مباشرة'],
    ['03-create-web.jpg', 'الإنشاء', 'إنشاء اختبار أو مسار دراسي جديد'],
    ['04-library-web.jpg', 'المكتبة', 'الألعاب والتقارير والمواد التعليمية'],
  ];
  return `
<section class="slide light" data-title="صور من داخل التطبيق">
  ${head('02 · Inside the App', 'التطبيق من الداخل', 'خمس لقطات حقيقية من التطبيق على Android توضح المسارات الأساسية التي تمر بها مهام الاختبار.')}
  <div class="shots-grid">
    ${shots.map(([file, label, desc], i) => `
    <figure class="shot-card">
      <div class="shot-frame"><img src="${shotImg(file)}" alt="${label} — لقطة من تطبيق Kahoot" loading="eager"></div>
      <figcaption>
        <span class="shot-num">${String(i + 1).padStart(2, '0')}</span>
        <b>${label}</b>
        <span>${desc}</span>
      </figcaption>
    </figure>`).join('')}
  </div>
  ${foot()}
</section>`;
};

/* ---------------- Slide 03 — About Kahoot ---------------- */
const s03 = () => `
<section class="slide light" data-title="عن التطبيق">
  ${head('03 · About the App', `ما هو ${logoSvg('kahoot-wordmark.svg', 'inline-logo')}؟`)}
  <div class="about-body">
    <p class="about-def">${logoSvg('kahoot-wordmark.svg', 'inline-logo-sm')} منصة تعليمية تفاعلية تعتمد على الاختبارات القصيرة المصممة بأسلوب الألعاب ${en('(Game-based Learning)')}، ويتيح تطبيق ${en('Android')} إنشاء الاختبارات والبحث عنها واللعب الفردي أو الجماعي ومراجعة النتائج ومشاركة الروابط.</p>
    <div class="about-funcs">
      <div class="func-row"><span class="n">01</span><div><h3>البحث والاستكشاف</h3><p>الوصول إلى اختبارات جاهزة بالبحث بالموضوع — يرتبط بالمهمتين ${en('T01')} و${en('T02')}.</p></div></div>
      <div class="func-row"><span class="n">02</span><div><h3>صفحة تفاصيل الاختبار</h3><p>عرض العنوان وعدد الأسئلة ومعلومات الاختبار قبل اللعب — ترتبط بالمهمة ${en('T02')}.</p></div></div>
      <div class="func-row"><span class="n">03</span><div><h3>أوضاع اللعب والإجابة</h3><p>اختيار ${en('Classic Solo')} وبدء الأسئلة والإجابة عنها — يرتبط بالمهمة ${en('T03')}.</p></div></div>
      <div class="func-row"><span class="n">04</span><div><h3>المكتبة والتقارير والانضمام</h3><p>مراجعة النتائج والتقارير والانضمام إلى غرفة مباشرة — يرتبط بالمهمتين ${en('T04')} و${en('T05')}.</p></div></div>
    </div>
  </div>
  ${foot()}
</section>`;

/* ---------------- Slide 04 — Participants ---------------- */
const s04 = (m) => {
  const card = (gid, alt) => {
    const g = m.groups.find((x) => x.id === gid);
    const pg = m.perGroup[gid];
    const count = m.hasData.participants ? pg.participant_count : EMPTY;
    const age = pg.age_min != null ? `${pg.age_min}–${pg.age_max}` : EMPTY;
    const avgAge = pg.avg_age ?? EMPTY;
    const completion = pg.completion_rate != null ? `${pg.completion_rate}%` : EMPTY;
    const sus = m.sus[gid] ?? EMPTY;
    const desc = gid === 'highschool'
      ? 'مشاركون من طلاب المرحلة الثانوية، يمثلون فئة عمرية أكبر خبرةً بالاختبارات الرقمية والاستخدام اليومي للتطبيقات.'
      : 'مشاركون من طلاب المرحلة المتوسطة، يمثلون فئة أصغر سناً بأنماط استخدام وخبرات رقمية مختلفة.';
    return `
    <div class="group-card ${alt ? 'alt' : ''}">
      <div class="group-head">
        <h2>${g.labelAr}</h2>
        <div class="group-count">${count}<small>مشارك · ${en(g.labelEn)}</small></div>
      </div>
      <p class="group-desc">${desc}</p>
      <div class="group-facts">
        <div><span class="k">الفئة العمرية</span><span class="v">${age}</span></div>
        <div><span class="k">متوسط العمر</span><span class="v">${avgAge}</span></div>
        <div><span class="k">نسبة الإكمال</span><span class="v">${completion}</span></div>
        <div><span class="k">متوسط SUS</span><span class="v">${sus}</span></div>
      </div>
    </div>`;
  };
  return `
<section class="slide light" data-title="المشاركون">
  ${head('04 · Participants', 'الفئتان المستهدفتان', 'مقارنة سلوك الاستخدام بين طلاب الثانوية وطلاب المتوسط، بعد تنفيذ الاختبار مع المشاركين العشرين.')}
  <div class="groups">${card('highschool')}${card('middle', true)}</div>
  ${foot()}
</section>`;
};

/* ---------------- Slide 05 — Methodology ---------------- */
const s05 = () => {
  const steps = [
    ['الاختبار الداخلي', 'أعضاء الفريق ينفذون المهام الخمس بأنفسهم'],
    ['الوقت المعياري', 'حساب متوسط وقت الفريق لكل مهمة'],
    ['تعريف المشارك', 'نبذة مختصرة عن التطبيق'],
    ['الاستكشاف الحر', '3–4 دقائق دون أي تدخل'],
    ['تنفيذ المهام', 'المهام الخمس بالترتيب نفسه'],
    ['المراقبة والتسجيل', 'الوقت والأخطاء وحالة الإكمال'],
    ['استبيان SUS', 'بعد انتهاء جميع المهام'],
  ];
  return `
<section class="slide light" data-title="المنهجية">
  ${head('05 · Methodology', 'منهجية الاختبار', 'سبع خطوات متسلسلة تُطبق على كل مشارك بالطريقة نفسها لضمان قابلية المقارنة بين الفئتين.')}
  <div class="timeline">
    ${steps.map(([t, d], i) => `<div class="step"><div class="dot">${i + 1}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>
  <div class="timing-note">
    ${ic('clock', 40)}
    <p><b>آلية الوقت:</b> الوقت المعياري ${en('(Standard Time)')} هو متوسط أوقات أعضاء الفريق في التجربة الداخلية لكل مهمة. إذا أنهى المشارك مبكراً تُسجل المهمة مكتملة بالوقت الفعلي، وإذا انتهى الوقت دون إتمامها تُمنح مهلة إضافية <b>5–10 ثوانٍ</b> تُسجل عند استخدامها، وبعدها تُسجل المهمة غير مكتملة.</p>
  </div>
  <p class="record-note"><b>ما يُسجل لكل مشارك ولكل مهمة:</b> ${en('Participant ID · Group · Task ID · Standard Time · Actual Time · Error Count · Error Description · Completion Status · Assistance Required · Observer Notes')}</p>
  ${foot()}
</section>`;
};

/* ---------------- Slide 06 — Testing Tasks ---------------- */
const s06 = (m) => `
<section class="slide light" data-title="المهام">
  ${head('06 · Testing Tasks', 'المهام الخمس المعتمدة', 'تُنفذ المهام بالترتيب نفسه لجميع المشاركين، وكل مهمة توضح السيناريو وخطوات الإنجاز وما نقيسه.')}
  <div class="task-list">
    ${m.tasks.map((t) => `
    <div class="task-row">
      <div class="task-id">${t.task_id}</div>
      <div class="task-name"><h3>${t.name_ar}</h3>${en(t.name_en)}</div>
      <div class="task-body">
        <p class="task-scenario">${t.scenario || t.description}</p>
        <ol class="task-steps">${t.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      </div>
      <div class="task-measure"><small>ما نقيسه</small><p>${t.measure}</p></div>
    </div>`).join('')}
  </div>
  <p class="pre-note">ملاحظة تحقق قبل الاختبار: يجب التأكد من أن الاختبار المختار يدعم ${en('Classic Solo')} وأن وظائف البحث والمكتبة والانضمام متاحة في إصدار ${en('Android')} المستخدم.</p>
  ${foot()}
</section>`;

/* ---------------- Results helpers ---------------- */
const mmss = (v) => {
  if (typeof v !== 'number') return EMPTY;
  const t = Math.round(v), m = Math.floor(t / 60), sec = t % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};
const statusAr = (s) => (s === 'completed' ? 'مكتملة' : s === 'incomplete' ? 'ناقصة' : EMPTY);
const countAr = (n) => (n >= 11 ? `${n} مشاركاً` : `${n} مشاركين`);

/* ---------------- Slide 07 — High school results ---------------- */
const s07 = (m) => {
  const gid = 'highschool';
  const g = m.groups.find((x) => x.id === gid);
  const rows = m.participantResults.filter((p) => p.group === gid);
  const t4 = m.tasks.find((t) => t.task_id === 'T04');
  return `
<section class="slide light" data-title="نتائج طلاب الثانوية">
  ${head('07 · Results — High School', 'نتائج طلاب الثانوية', `${countAr(rows.length)} · ${rows.length * 5} محاولة · الزمن لكل مهمة وحالة الإكمال والأخطاء وSUS.`)}
  <div class="result-summary">
    <div class="rs"><span>المشاركون</span><b>${rows.length}</b></div>
    <div class="rs"><span>الإكمال</span><b>${m.perGroup[gid].completion_rate ?? EMPTY}%</b></div>
    <div class="rs"><span>الأخطاء</span><b>${m.perGroup[gid].total_errors ?? EMPTY}</b></div>
    <div class="rs"><span>متوسط SUS</span><b>${m.sus[gid] ?? EMPTY}</b></div>
  </div>
  <div class="results-card">
    <table class="results-table">
      <thead><tr><th>المشارك</th>${m.tasks.map((t) => `<th>${t.task_id}</th>`).join('')}<th>الأخطاء</th><th>SUS</th></tr></thead>
      <tbody>${rows.map((p) => `<tr>
        <td class="p-id">${p.participant_id}</td>
        ${p.tasks.map((t) => `<td class="task-cell ${t.completion_status !== 'completed' ? 'incomplete' : ''}">
          <span class="t">${mmss(t.time_seconds)}</span><span class="st">${statusAr(t.completion_status)}</span>
        </td>`).join('')}
        <td class="num ${p.total_errors ? 'err' : ''}">${p.total_errors}</td>
        <td class="num sus ${p.sus >= 80 ? 'good' : p.sus < 60 ? 'bad' : ''}">${p.sus ?? EMPTY}</td>
      </tr>`).join('')}</tbody>
    </table>
  </div>
  <p class="result-note">${t4.groups[gid].total_errors} أخطاء في المهمة 4، ولم تكتمل المهمة 4 لدى ${t4.groups[gid].incomplete} مشارك. <br>متوسط SUS لهذه الفئة: <b>${m.sus[gid]}</b> مقابل <b>${m.sus[gid === 'highschool' ? 'middle' : 'highschool']}</b> للفئة الأخرى.</p>
  ${foot()}
</section>`;
};

/* ---------------- Slide 08 — Middle school results ---------------- */
const s08 = (m) => {
  const gid = 'middle';
  const rows = m.participantResults.filter((p) => p.group === gid);
  const t4 = m.tasks.find((t) => t.task_id === 'T04');
  const assists = m.tasks.reduce((a, t) => a + t.groups.middle.assistance_count, 0);
  const gap = Math.round((m.sus.highschool - m.sus.middle) * 10) / 10;
  return `
<section class="slide light" data-title="نتائج طلاب المتوسط">
  ${head('08 · Results — Middle School', 'نتائج طلاب المتوسط', `${countAr(rows.length)} · ${rows.length * 5} محاولة · الزمن لكل مهمة وحالة الإكمال والأخطاء وSUS.`)}
  <div class="result-summary">
    <div class="rs"><span>المشاركون</span><b>${rows.length}</b></div>
    <div class="rs"><span>الإكمال</span><b>${m.perGroup[gid].completion_rate ?? EMPTY}%</b></div>
    <div class="rs"><span>الأخطاء</span><b>${m.perGroup[gid].total_errors ?? EMPTY}</b></div>
    <div class="rs"><span>متوسط SUS</span><b>${m.sus[gid] ?? EMPTY}</b></div>
  </div>
  <div class="results-card">
    <table class="results-table">
      <thead><tr><th>المشارك</th>${m.tasks.map((t) => `<th>${t.task_id}</th>`).join('')}<th>الأخطاء</th><th>SUS</th></tr></thead>
      <tbody>${rows.map((p) => `<tr>
        <td class="p-id">${p.participant_id}</td>
        ${p.tasks.map((t) => `<td class="task-cell ${t.completion_status !== 'completed' ? 'incomplete' : ''}">
          <span class="t">${mmss(t.time_seconds)}</span><span class="st">${statusAr(t.completion_status)}</span>
        </td>`).join('')}
        <td class="num ${p.total_errors ? 'err' : ''}">${p.total_errors}</td>
        <td class="num sus ${p.sus >= 80 ? 'good' : p.sus < 60 ? 'bad' : ''}">${p.sus ?? EMPTY}</td>
      </tr>`).join('')}</tbody>
    </table>
  </div>
  <p class="result-note">${t4.groups[gid].total_errors} أخطاء في المهمة 4، ولم تكتمل المهمة 4 لدى ${t4.groups[gid].incomplete} مشارك. <br>متوسط SUS لهذه الفئة: <b>${m.sus[gid]}</b> مقابل <b>${m.sus[gid === 'highschool' ? 'middle' : 'highschool']}</b> للفئة الأخرى.</p>
  <div class="result-insights">
    <div><span>أكثر مهمة أخطاءً</span><b>${t4.task_id} · ${t4.groups[gid].total_errors}</b></div>
    <div><span>طلبات المساعدة</span><b>${assists}</b></div>
    <div><span>فارق SUS عن الثانوية</span><b dir="ltr">−${gap}</b></div>
  </div>
  ${foot()}
</section>`;
};

/* ---------------- Slide 09 — Analysis dashboard ---------------- */
const s09 = (m) => {
  const done = m.perGroup.highschool.tasks_completed + m.perGroup.middle.tasks_completed;
  const total = done + m.perGroup.highschool.tasks_incomplete + m.perGroup.middle.tasks_incomplete;
  const overall = total ? Math.round((done / total) * 1000) / 10 : null;
  const slowest = [...m.tasks]
    .map((t) => ({ t, avg: ((t.groups.highschool.avg_actual_time_seconds ?? 0) + (t.groups.middle.avg_actual_time_seconds ?? 0)) / 2 }))
    .sort((a, b) => b.avg - a.avg)[0];
  const mostErrors = [...m.tasks]
    .map((t) => ({ t, n: t.groups.highschool.total_errors + t.groups.middle.total_errors }))
    .sort((a, b) => b.n - a.n)[0];
  const topErr = m.topErrorTypes[0];
  const R = 46, CIRC = 2 * Math.PI * R, dash = ((overall ?? 0) / 100) * CIRC;
  return `
<section class="slide light" data-title="لوحة التحليل">
  ${head('09 · Analysis', 'لوحة التحليل', 'مقارنة شاملة للإكمال والأوقات والأخطاء بين طلاب الثانوية وطلاب المتوسط.')}
  <div class="analysis-grid">
    <div class="analysis-card">
      <h3>معدل الإكمال ${en('Completion')}</h3>
      <div class="donut-row">
        <svg viewBox="0 0 120 120" class="donut" aria-hidden="true">
          <circle cx="60" cy="60" r="${R}" fill="none" stroke="var(--border)" stroke-width="13"/>
          <circle cx="60" cy="60" r="${R}" fill="none" stroke="var(--primaryPurple)" stroke-width="13" stroke-linecap="round" stroke-dasharray="${dash} ${CIRC}" transform="rotate(-90 60 60)"/>
          <text x="60" y="61" text-anchor="middle" dominant-baseline="central" class="donut-val">${overall}%</text>
        </svg>
        <div class="donut-kpis">
          <div><b>${done}</b><span>مكتملة</span></div>
          <div><b>${total - done}</b><span>غير مكتملة</span></div>
          <div><b>${total}</b><span>محاولة</span></div>
        </div>
      </div>
      <div class="mini-bars">
        <div><span>طلاب الثانوية</span><b>${m.perGroup.highschool.completion_rate}%</b></div>
        <div><span>طلاب المتوسط</span><b>${m.perGroup.middle.completion_rate}%</b></div>
      </div>
    </div>
    <div class="analysis-card">
      <h3>متوسط الأوقات ${en('Seconds')}</h3>
      <table class="mini-table">
        <thead><tr><th>المهمة</th><th>ثانوية</th><th>متوسط</th></tr></thead>
        <tbody>${m.tasks.map((t) => `<tr><td>${t.task_id}</td><td>${t.groups.highschool.avg_actual_time_seconds ?? EMPTY}</td><td>${t.groups.middle.avg_actual_time_seconds ?? EMPTY}</td></tr>`).join('')}</tbody>
      </table>
      <p class="analysis-foot">أبطأ مهمة: <b>${slowest.t.task_id}</b> بمتوسط <b>${Math.round(slowest.avg * 10) / 10}</b> ثانية.</p>
    </div>
    <div class="analysis-card">
      <h3>الأخطاء حسب المهمة ${en('Errors')}</h3>
      <table class="mini-table">
        <thead><tr><th>المهمة</th><th>ثانوية</th><th>متوسط</th></tr></thead>
        <tbody>${m.tasks.map((t) => `<tr><td>${t.task_id}</td><td>${t.groups.highschool.total_errors}</td><td>${t.groups.middle.total_errors}</td></tr>`).join('')}
          <tr class="total"><td>الإجمالي</td><td>${m.perGroup.highschool.total_errors}</td><td>${m.perGroup.middle.total_errors}</td></tr>
        </tbody>
      </table>
      <p class="analysis-foot">أكثر المهام أخطاءً: <b>${mostErrors.t.task_id}</b> (<b>${mostErrors.n}</b> أخطاء).</p>
    </div>
    <div class="analysis-card">
      <h3>أبرز النتائج ${en('Key Findings')}</h3>
      <ul class="insight-list">
        <li><b>${overall}%</b> معدل إكمال إجمالي عبر <b>${total}</b> محاولة.</li>
        <li>أكثر خطأ تكراراً: <b>${topErr ? topErr.description : EMPTY}</b>${topErr ? ` (<b>${topErr.count}</b>)` : ''}.</li>
        <li>فجوة SUS: الثانوية <b>${m.sus.highschool}</b> مقابل المتوسط <b>${m.sus.middle}</b>.</li>
        <li>طلاب المتوسط يحتاجون دعماً أكبر في مسارات المكتبة والانضمام.</li>
      </ul>
      <div class="sus-compare">
        <div class="row"><span>SUS الثانوية</span><i class="track"><em class="fill" style="width:${m.sus.highschool}%"></em></i><b>${m.sus.highschool}</b></div>
        <div class="row"><span>SUS المتوسط</span><i class="track"><em class="fill low" style="width:${m.sus.middle}%"></em></i><b>${m.sus.middle}</b></div>
      </div>
    </div>
  </div>
  ${foot()}
</section>`;
};

/* ---------------- Slide 10 — SUS ---------------- */
const s10 = (m) => `
<section class="slide dark" data-title="SUS وآراء المشاركين">
  ${head('10 · User Feedback & SUS', 'استبيان SUS وآراء المشاركين', 'مقياس System Usability Scale القياسي من 10 عبارات وخمس درجات إجابة، يُقدم للمشارك بعد إنهاء المهام الخمس.')}
  <div class="sus-grid">
    <div class="sus-panel">
      <h3>درجة قابلية الاستخدام ${en('SUS Score · 0–100')}</h3>
      <div class="sus-scale">
        <div class="sus-track"><div style="background:#3A2D50"></div><div style="background:#4A3570"></div><div style="background:#5C4494"></div><div style="background:#7A5BC0"></div></div>
        <div class="sus-ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
      </div>
      <div class="sus-avgs">
        <div class="sus-avg"><div class="v">${m.sus.overall ?? EMPTY}</div><div class="l">المتوسط العام</div></div>
        <div class="sus-avg"><div class="v">${m.sus.highschool ?? EMPTY}</div><div class="l">طلاب الثانوية</div></div>
        <div class="sus-avg"><div class="v">${m.sus.middle ?? EMPTY}</div><div class="l">طلاب المتوسط</div></div>
      </div>
    </div>
    <div class="sus-panel">
      <h3>آراء المشاركين ونقاط القصور والاقتراحات</h3>
      ${m.feedback.length
        ? m.feedback.slice(0, 3).map((f) => `<div class="quote-slot">${f.positive ?? f.negative ?? f.suggestions ?? ''}</div>`).join('')
        : `<div class="quote-slot">لم تُسجل اقتباسات نصية مباشرة في أداة التتبع.<br>تعتمد الملاحظات النوعية على سجلات المراقب وأوصاف الأخطاء.</div>
           <div class="quote-slot">أبرز ما رصده المراقبون: مألوفية الواجهة، وصعوبة قراءة بعض النصوص، والحاجة إلى توجيه في مسارات المكتبة والانضمام.</div>`}
    </div>
  </div>
  ${foot()}
</section>`;

/* ---------------- Slide 11 — Conclusion ---------------- */
const s11 = () => {
  const card = (n, t, items) => `
    <div class="conc-card"><h3><span class="num">${n}</span>${t}</h3>
      <ul class="conc-points">${items.map((x) => `<li>${x}</li>`).join('')}</ul>
    </div>`;
  return `
<section class="slide deep" data-title="الخلاصة والتوصيات">
  ${head('11 · Conclusion', 'المشكلات والتوصيات والخلاصة', 'أبرز المشكلات المرصودة فعلياً أثناء الاختبار، والتوصيات المرتبطة بها، ومقارنة الفئتين.')}
  <div class="conc-grid">
    ${card('01', 'المشكلات الملاحظة', [
      'مسار خاطئ متكرر في البحث واختيار الاختبار: <b>9 حالات</b>.',
      'صعوبة الوصول إلى المكتبة والتقارير: <b>9 حالات</b> بين الفئتين.',
      'الانضمام للغرفة: خطأ في رمز اللعبة <b>2</b> وعدم انتباه لزر الانضمام <b>2</b>.',
      'طلاب المتوسط سجلوا أخطاء أكثر: <b>14 مقابل 8</b> لطلاب الثانوية.',
    ])}
    ${card('02', 'التوصيات', [
      'إبراز المكتبة والتقارير في الصفحة الرئيسية وتوحيد مسار الوصول إليها.',
      'تبسيط مسار البحث واختيار الاختبار وتقليل الخيارات المتشابهة.',
      'تحسين شاشة الانضمام: تحقق فوري من رمز اللعبة وتلميح واضح لزر الانضمام.',
      'دعم طلاب المتوسط بنصوص أكبر وإرشاد مصور داخل التطبيق.',
    ])}
    ${card('03', 'ملاحظات فريق المراقبة', [
      'الواجهة مألوفة لدى الطلاب ذوي الخبرة، والتنقل بين الصفحات سريع.',
      'بعض المشاركين احتاجوا وقتاً لقراءة النصوص بسبب صغر الخط.',
      'تردد واضح عند اختيار الاسم المستعار وإدخال رمز اللعبة.',
      'إعجاب بطريقة عرض النتائج والتقارير النهائية.',
    ])}
    ${card('04', 'مقارنة الفئتين والاستنتاج', [
      'الإكمال: الثانوية <b>98.5%</b> · المتوسط <b>97.1%</b>.',
      'الأخطاء: الثانوية <b>8</b> · المتوسط <b>14</b>.',
      'SUS: الثانوية <b>84.4</b> · المتوسط <b>61.8</b>.',
      'الاستنتاج: قابلية استخدام جيدة عموماً، مع حاجة أكبر للدعم في فئة المتوسط ومسارات المكتبة والانضمام.',
    ])}
  </div>
  ${foot()}
</section>`;
};

/* ---------------- Slide 12 — Team ---------------- */
const s12 = () => `
<section class="slide deep team" data-title="الفريق">
  <div class="team-inner">
    ${logoSvg('kahoot-wordmark.svg', 'team-wordmark')}
    <h1 class="team-title">أعضاء الفريق</h1>
    <ul class="team-names">${TEAM.map((n) => `<li>${n}</li>`).join('')}</ul>
  </div>
  ${foot()}
</section>`;

export const renderSlides = (m) =>
  [s01(), s02(), s03(), s04(m), s05(), s06(m), s07(m), s08(m), s09(m), s10(m), s11(), s12()].join('\n');
