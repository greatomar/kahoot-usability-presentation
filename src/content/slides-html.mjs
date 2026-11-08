/**
 * Slide content + markup for the HTML deck.
 * All results regions render from the metrics object — with no data they render
 * designed empty states. Nothing here fabricates a number.
 */
import { EMPTY, AWAITING_AR, AWAITING_EN } from '../design/tokens.mjs';

const en = (t) => `<span class="en">${t}</span>`;
const emptyTag = () => `<span class="empty-tag">${AWAITING_AR} ${en(AWAITING_EN)}</span>`;

const icons = {
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
};
const ic = (name, size = 26, color = 'var(--primaryPurple)') =>
  `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;

const head = (kicker, title, sub = '') => `
  <div class="head">
    <span class="kicker">${kicker}</span>
    <h1 class="slide-title">${title}</h1>
    ${sub ? `<p class="slide-sub">${sub}</p>` : ''}
  </div>`;

const foot = (n) => `
  <div class="foot">
    <span class="en">${String(n).padStart(2, '0')} / 10</span>
    <span class="bar"></span>
    <span>Kahoot Usability · HCI Project</span>
  </div>`;

/* ---------------- Slide 01 — Cover ---------------- */
const s01 = () => `
<section class="slide deep cover" data-title="الغلاف">
  <div class="cover-geo" aria-hidden="true">
    <div class="geo geo-triangle"></div><div class="geo geo-ring"></div>
    <div class="geo geo-circle"></div><div class="geo geo-square"></div><div class="geo geo-line"></div>
  </div>
  <div class="cover-inner">
    <span class="cover-badge">مشروع مقرر تفاعل الإنسان والحاسوب · ${en('Human–Computer Interaction')}</span>
    <h1 class="cover-title">Usability Testing of<br><span class="hl">Kahoot Android</span><br>Application</h1>
    <p class="cover-ar">دراسة اختبار قابلية الاستخدام ومقارنة بين طلاب الجامعة وطلاب الثانوية</p>
    <div class="cover-meta">
      <div class="row"><span>أعضاء الفريق — ${en('Group A')}:</span><span class="blank">&nbsp;</span></div>
      <div class="row"><span>${en('Group B')}:</span><span class="blank">&nbsp;</span></div>
      <div class="row"><span>اسم المقرر:</span><span class="blank">&nbsp;</span></div>
      <div class="row"><span>اسم الدكتور:</span><span class="blank">&nbsp;</span></div>
      <div class="row"><span>تاريخ العرض:</span><span class="blank">&nbsp;</span></div>
    </div>
  </div>
  ${foot(1)}
</section>`;

/* ---------------- Slide 02 — About Kahoot ---------------- */
const s02 = () => `
<section class="slide light" data-title="عن التطبيق">
  ${head('02 · About Kahoot', 'ما هو Kahoot؟')}
  <div class="about-grid">
    <div>
      <div class="phone">
        <div class="phone-slot">
          ${ic('image', 44, 'var(--purpleMid)')}
          <p>مكان مخصص للقطة شاشة حقيقية<br>من تطبيق ${en('Kahoot Android')}<br>${en('Screenshot placeholder')}</p>
        </div>
      </div>
    </div>
    <div>
      <p class="about-def"><b>Kahoot</b> منصة تعليمية تفاعلية تعتمد على الاختبارات القصيرة المصممة بأسلوب الألعاب ${en('(Game-based Learning)')}، ويتيح تطبيق ${en('Android')} إنشاء الاختبارات والبحث عنها واللعب الفردي أو الجماعي ومراجعة النتائج ومشاركة الروابط.</p>
      <div class="about-funcs">
        <div class="func-row"><span class="n">01</span><div><h3>البحث والاستكشاف</h3><p>الوصول إلى اختبارات جاهزة بالبحث بالموضوع — يرتبط بالمهمتين ${en('T01')} و${en('T02')}.</p></div></div>
        <div class="func-row"><span class="n">02</span><div><h3>صفحة تفاصيل الاختبار</h3><p>عرض العنوان وعدد الأسئلة ومعلومات الاختبار قبل اللعب — ترتبط بالمهمة ${en('T02')}.</p></div></div>
        <div class="func-row"><span class="n">03</span><div><h3>أوضاع اللعب واللعب الفردي</h3><p>اختيار ${en('Classic Solo')} وبدء الأسئلة والإجابة عنها — يرتبط بالمهمتين ${en('T03')} و${en('T04')}.</p></div></div>
        <div class="func-row"><span class="n">04</span><div><h3>النتيجة والمشاركة</h3><p>مراجعة النتيجة النهائية ثم مشاركة الاختبار ونسخ الرابط — ترتبط بالمهمة ${en('T05')}.</p></div></div>
      </div>
    </div>
  </div>
  ${foot(2)}
</section>`;

/* ---------------- Slide 03 — Participants ---------------- */
const s03 = (m) => {
  const card = (gid, alt) => {
    const g = m.groups.find((x) => x.id === gid);
    const count = m.hasData.participants ? m.perGroup[gid].participant_count : EMPTY;
    const desc = gid === 'university'
      ? 'مشاركون من طلاب الجامعة، يمتلكون خبرة أوسع نسبياً بالتطبيقات التعليمية والتفاعل الرقمي اليومي.'
      : 'مشاركون من طلاب المرحلة الثانوية، يمثلون فئة أصغر سناً بأنماط استخدام وخبرات رقمية مختلفة.';
    return `
    <div class="group-card ${alt ? 'alt' : ''}">
      <div class="group-head">
        <h2>${g.labelAr}</h2>
        <div class="group-count">${count}<small>مشارك · ${en(g.labelEn)}</small></div>
      </div>
      <p class="group-desc">${desc}</p>
      <p class="group-min">الحد الأدنى في الدراسة الفعلية: 4 مشاركين على الأقل لكل فئة — العدد النهائي يُحدد بعد التنفيذ.</p>
      <div class="photo-slots">${Array.from({ length: 4 }, () => `<div class="photo-slot">${ic('camera', 26, 'var(--secondaryText)')}</div>`).join('')}</div>
      <p class="consent-note">أماكن مخصصة لصور المشاركين أثناء الاختبار — تُضاف بعد الحصول على موافقتهم فقط.</p>
    </div>`;
  };
  return `
<section class="slide light" data-title="المشاركون">
  ${head('03 · Participants', 'الفئتان المستهدفتان', 'مقارنة سلوك الاستخدام بين فئتين عمريتين ودراسيتين مختلفتين، دون افتراض عدد نهائي للمشاركين قبل تنفيذ الدراسة.')}
  <div class="groups">${card('university')}${card('highschool', true)}</div>
  ${foot(3)}
</section>`;
};

/* ---------------- Slide 04 — Methodology ---------------- */
const s04 = () => {
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
  ${head('04 · Methodology', 'منهجية الاختبار', 'سبع خطوات متسلسلة تُطبق على كل مشارك بالطريقة نفسها لضمان قابلية المقارنة بين الفئتين.')}
  <div class="timeline">
    ${steps.map(([t, d], i) => `<div class="step"><div class="dot">${i + 1}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>
  <div class="timing-note">
    ${ic('clock', 40)}
    <p><b>آلية الوقت:</b> الوقت المعياري ${en('(Standard Time)')} هو متوسط أوقات أعضاء الفريق في التجربة الداخلية لكل مهمة. إذا أنهى المشارك مبكراً تُسجل المهمة مكتملة بالوقت الفعلي، وإذا انتهى الوقت دون إتمامها تُمنح مهلة إضافية <b>5–10 ثوانٍ</b> تُسجل عند استخدامها، وبعدها تُسجل المهمة غير مكتملة.</p>
  </div>
  <p class="record-note"><b>ما يُسجل لكل مشارك ولكل مهمة:</b> ${en('Participant ID · Group · Task ID · Standard Time · Actual Time · Error Count · Error Description · Completion Status · Assistance Required · Observer Notes')}</p>
  ${foot(4)}
</section>`;
};

/* ---------------- Slide 05 — Testing Tasks ---------------- */
const s05 = (m) => `
<section class="slide light" data-title="المهام">
  ${head('05 · Testing Tasks', 'المهام الخمس المعتمدة', 'تُنفذ المهام بالترتيب نفسه لجميع المشاركين، والوقت المعياري يُحسب من التجربة الداخلية قبل الاختبار الفعلي.')}
  <div class="task-list">
    ${m.tasks.map((t) => `
    <div class="task-row">
      <div class="task-id">${t.task_id}</div>
      <div class="task-name"><h3>${t.name_ar}</h3>${en(t.name_en)}</div>
      <div class="task-desc">${t.description ?? ''}${taskDesc(t.task_id)}</div>
      <div class="task-std"><span class="v">${t.standard_time_seconds ?? EMPTY}</span><small>الوقت المعياري (ثانية)</small></div>
    </div>`).join('')}
  </div>
  <p class="pre-note">ملاحظة تحقق قبل الاختبار: يجب التأكد من أن الاختبار المختار يدعم ${en('Classic Solo')} وأن وظائف البحث والمشاركة متاحة في إصدار ${en('Android')} المستخدم — لم يتم التحقق منها بعد.</p>
  ${foot(5)}
</section>`;
const taskDesc = (id) => ({
  T01: 'الانتقال إلى قسم البحث أو الاستكشاف والبحث عن اختبار في موضوع علوم الحاسوب (Computer Science).',
  T02: 'فتح صفحة تفاصيل الاختبار المحدد من النتائج والتعرف على عنوانه وعدد أسئلته.',
  T03: 'استعراض أوضاع اللعب واختيار Classic Solo لبدء الاختبار وإدخال اسم مستعار عند الطلب.',
  T04: 'الإجابة عن جميع أسئلة الاختبار باختيار إجابة واحدة لكل سؤال حتى النهاية.',
  T05: 'استعراض النتيجة النهائية ثم العودة لصفحة التفاصيل وفتح الخيارات واختيار Share ونسخ رابط الاختبار.',
}[id] ?? '');

/* ---------------- Slide 06 — Completion ---------------- */
const s06 = (m) => {
  const W = 900, H = 380, L = 70, B = 46, T = 20;
  const plotH = H - B - T, plotW = W - L - 20;
  const ticks = [0, 25, 50, 75, 100];
  const grid = ticks.map((v) => {
    const y = T + plotH - (v / 100) * plotH;
    return `<line x1="${L}" y1="${y}" x2="${W - 20}" y2="${y}" stroke="var(--border)" stroke-width="1"/>
            <text x="${L - 12}" y="${y + 5}" text-anchor="end" font-family="Inter" font-size="14" fill="var(--secondaryText)">${v}%</text>`;
  }).join('');
  const cats = m.tasks.map((t, i) => {
    const x = L + (plotW / 5) * i + plotW / 10;
    return `<text x="${x}" y="${H - 14}" text-anchor="middle" font-family="Inter" font-size="15" font-weight="600" fill="var(--deepPurple)">${t.task_id}</text>`;
  }).join('');
  const stat = (lbl, v) => `<div class="stat-box"><div class="lbl">${lbl}</div><div class="val">${v}</div></div>`;
  const bars = m.hasData.observations ? m.tasks.map((t, i) => {
    const slot = plotW / 5, cx0 = L + slot * i + slot / 2, bw = slot * 0.22;
    return ['university', 'highschool'].map((g, gi) => {
      const r = t.groups[g].completion_rate;
      if (r == null) return '';
      const h = (r / 100) * plotH, x = cx0 + (gi === 0 ? -bw - 4 : 4);
      return `<rect x="${x}" y="${T + plotH - h}" width="${bw}" height="${h}" rx="5" fill="var(--${gi === 0 ? 'primaryPurple' : 'accent'})"/>`;
    }).join('');
  }).join('') : '';
  const overlay = m.hasData.observations ? '' : `<div class="chart-overlay">${emptyTag()}</div>`;
  return `
<section class="slide light" data-title="إكمال المهام">
  ${head('06 · Task Completion', 'تحليل إكمال المهام', 'معدل إكمال كل مهمة لكل فئة، مع عدد المهام المكتملة وغير المكتملة — تُحسب جميعها من سجلات الملاحظة بعد الدراسة.')}
  <div class="split-6">
    <div class="chart-wrap">
      <div class="chart-title">معدل الإكمال حسب المهمة والفئة ${en('Completion Rate %')}</div>
      <svg viewBox="0 0 ${W} ${H}" width="100%" style="margin-top:12px">${grid}${cats}${bars}
        <line x1="${L}" y1="${T}" x2="${L}" y2="${T + plotH}" stroke="var(--secondaryText)"/>
        <line x1="${L}" y1="${T + plotH}" x2="${W - 20}" y2="${T + plotH}" stroke="var(--secondaryText)"/>
      </svg>
      <div class="legend"><span><i class="sw" style="background:var(--primaryPurple)"></i>طلاب الجامعة</span><span><i class="sw" style="background:var(--accent)"></i>طلاب الثانوية</span></div>
      ${overlay}
    </div>
    <div class="stat-stack">
      ${stat('معدل الإكمال — طلاب الجامعة', m.perGroup.university.completion_rate != null ? m.perGroup.university.completion_rate + '%' : EMPTY)}
      ${stat('معدل الإكمال — طلاب الثانوية', m.perGroup.highschool.completion_rate != null ? m.perGroup.highschool.completion_rate + '%' : EMPTY)}
      ${stat('المهام المكتملة / غير المكتملة', m.hasData.observations ? `${m.perGroup.university.tasks_completed + m.perGroup.highschool.tasks_completed} / ${m.perGroup.university.tasks_incomplete + m.perGroup.highschool.tasks_incomplete}` : EMPTY)}
      <div class="stat-box"><div class="lbl">تُعرض الأعمدة هنا تلقائياً فور إدخال سجلات الملاحظة في ملف البيانات.</div></div>
    </div>
  </div>
  ${foot(6)}
</section>`;
};

/* ---------------- Slide 07 — Time ---------------- */
const s07 = (m) => `
<section class="slide light" data-title="تحليل الوقت">
  ${head('07 · Time Analysis', 'تحليل الأوقات', 'مقارنة الوقت المعياري بمتوسط الوقت الفعلي لكل مهمة ولكل فئة، ثم الزمن الكلي لكل مشارك.')}
  <div class="split-6">
    <div class="chart-wrap">
      <div class="chart-title">الوقت المعياري مقابل متوسط الوقت الفعلي ${en('Seconds')}</div>
      <table class="skeleton">
        <tr><th>المهمة</th><th>الوقت المعياري</th><th>متوسط الفعلي — جامعة</th><th>متوسط الفعلي — ثانوية</th></tr>
        ${m.tasks.map((t) => `<tr><td>${t.task_id} — ${t.name_ar}</td><td class="en">${t.standard_time_seconds ?? EMPTY}</td><td class="en">${t.groups.university.avg_actual_time_seconds ?? EMPTY}</td><td class="en">${t.groups.highschool.avg_actual_time_seconds ?? EMPTY}</td></tr>`).join('')}
      </table>
      <div class="legend"><span><i class="sw" style="background:var(--purpleMid)"></i>Standard</span><span><i class="sw" style="background:var(--primaryPurple)"></i>University</span><span><i class="sw" style="background:var(--accent)"></i>High School</span></div>
      ${m.hasData.observations ? '' : `<div class="chart-overlay">${emptyTag()}</div>`}
    </div>
    <div class="stat-stack">
      <div class="stat-box"><div class="lbl">الزمن الكلي لكل مشارك ${'(Total Time)'}</div>
        <table class="skeleton">
          <tr><th>المشارك</th><th>الفئة</th><th>الزمن (ث)</th></tr>
          ${(m.hasData.observations ? m.totalTimePerParticipant.slice(0, 5).map((p) => [p.participant_id, p.group === 'university' ? 'جامعة' : 'ثانوية', p.total_time_seconds ?? EMPTY]) : Array.from({ length: 3 }, () => [EMPTY, EMPTY, EMPTY])).map((r) => `<tr>${r.map((c) => `<td class="en">${c}</td>`).join('')}</tr>`).join('')}
        </table>
      </div>
      <div class="stat-box"><div class="lbl">عند توفر البيانات يتحول الجدول إلى مخطط أعمدة / ${en('Dumbbell Chart')} قابل للمقارنة مباشرة.</div></div>
    </div>
  </div>
  ${foot(7)}
</section>`;

/* ---------------- Slide 08 — Errors ---------------- */
const s08 = (m) => `
<section class="slide light" data-title="تحليل الأخطاء">
  ${head('08 · Error Analysis', 'تحليل الأخطاء والمساعدة', 'تمييز واضح بين الخطأ وطلب المساعدة والتردد، مع توثيق وصف كل خطأ فعلي أثناء الملاحظة.')}
  <div class="def-chips">
    <div class="def-chip"><h3>خطأ ${en('Error')}</h3><p>تنفيذ إجراء خاطئ أثناء المهمة، مثل الضغط على خيار غير مطلوب أو مسار غير صحيح.</p></div>
    <div class="def-chip a"><h3>مساعدة ${en('Assistance')}</h3><p>طلب المشارك مساعدة أو اضطرار المراقب للتدخل — تُسجل مستقلة عن الأخطاء.</p></div>
    <div class="def-chip h"><h3>تردد ${en('Hesitation')}</h3><p>تأخر أو توقف ملحوظ دون وقوع خطأ بالضرورة — يُدوّن في ملاحظات المراقب.</p></div>
  </div>
  <div class="split-6" style="margin-top:26px">
    <div class="chart-wrap">
      <div class="chart-title">الأخطاء حسب المهمة ${en('Errors per Task')}</div>
      <table class="skeleton">
        <tr><th>المهمة</th><th>جامعة</th><th>ثانوية</th></tr>
        ${m.tasks.map((t) => `<tr><td class="en">${t.task_id}</td><td class="en">${m.hasData.observations ? t.groups.university.total_errors : EMPTY}</td><td class="en">${m.hasData.observations ? t.groups.highschool.total_errors : EMPTY}</td></tr>`).join('')}
      </table>
      ${m.hasData.observations ? '' : `<div class="chart-overlay">${emptyTag()}</div>`}
    </div>
    <div class="stat-stack">
      <div class="stat-box"><div class="lbl">إجمالي الأخطاء — جامعة / ثانوية</div><div class="val">${m.hasData.observations ? `${m.perGroup.university.total_errors} / ${m.perGroup.highschool.total_errors}` : EMPTY}</div></div>
      <div class="stat-box"><div class="lbl">أكثر أنواع الأخطاء تكراراً وأوصافها الفعلية</div><div class="val">${m.topErrorTypes.length ? '' : EMPTY}</div><div class="lbl">${m.topErrorTypes.length ? m.topErrorTypes.slice(0, 2).map((e) => `${e.description} (${e.count})`).join(' · ') : 'تُستخرج من أوصاف الأخطاء المسجلة في سجلات الملاحظة.'}</div></div>
    </div>
  </div>
  ${foot(8)}
</section>`;

/* ---------------- Slide 09 — SUS ---------------- */
const s09 = (m) => `
<section class="slide dark" data-title="SUS وآراء المشاركين">
  ${head('09 · User Feedback & SUS', 'استبيان SUS وآراء المشاركين', 'مقياس System Usability Scale القياسي من 10 عبارات وخمس درجات إجابة، يُقدم للمشارك بعد إنهاء المهام الخمس.')}
  <div class="sus-grid">
    <div class="sus-panel">
      <h3>درجة قابلية الاستخدام ${en('SUS Score · 0–100')}</h3>
      <div class="sus-scale">
        <div class="sus-track"><div style="background:#3A2D50"></div><div style="background:#4A3570"></div><div style="background:#5C4494"></div><div style="background:#7A5BC0"></div></div>
        <div class="sus-ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
      </div>
      <div class="sus-avgs">
        <div class="sus-avg"><div class="v">${m.sus.overall ?? EMPTY}</div><div class="l">المتوسط العام</div></div>
        <div class="sus-avg"><div class="v">${m.sus.university ?? EMPTY}</div><div class="l">طلاب الجامعة</div></div>
        <div class="sus-avg"><div class="v">${m.sus.highschool ?? EMPTY}</div><div class="l">طلاب الثانوية</div></div>
      </div>
      <p class="sus-formula">طريقة الحساب القياسية: للبنود الفردية ${en('(1,3,5,7,9)')} الدرجة المعدلة = الإجابة − 1، وللبنود الزوجية ${en('(2,4,6,8,10)')} الدرجة المعدلة = 5 − الإجابة، ثم ${en('SUS = Σ Adjusted × 2.5')}.<br>تفسير النتيجة يُضاف بعد توفر البيانات الفعلية.</p>
    </div>
    <div class="sus-panel">
      <h3>آراء المشاركين ونقاط القصور والاقتراحات</h3>
      <div class="quote-slot">${emptyTag()}<br>تُضاف اقتباسات المشاركين الحقيقية وملاحظاتهم الإيجابية والسلبية هنا بعد الدراسة.</div>
      <div class="quote-slot">اقتراحات التحسين كما صاغها المشاركون — دون إضافة أو اختلاق.</div>
    </div>
  </div>
  ${foot(9)}
</section>`;

/* ---------------- Slide 10 — Conclusion ---------------- */
const s10 = () => {
  const card = (n, t, hint) => `
    <div class="conc-card"><h3><span class="num">${n}</span>${t}</h3>
      <div class="conc-lines"><div class="conc-line"></div><div class="conc-line"></div><div class="conc-line short"></div></div>
      <p class="conc-hint">${hint}</p></div>`;
  return `
<section class="slide deep" data-title="الخلاصة والتوصيات">
  ${head('10 · Conclusion', 'المشكلات والتوصيات والخلاصة', 'أقسام جاهزة للتعبئة بعد تنفيذ الدراسة الفعلية — لا تُعرض أي مشكلة أو استنتاج قبل رصده فعلياً في الاختبار.')}
  <div class="conc-grid">
    ${card('01', 'المشكلات الملاحظة', 'مشكلتان على الأقل ظهرتا في الاختبار الفعلي، موثقتان من سجلات الملاحظة وأوصاف الأخطاء.')}
    ${card('02', 'التوصيات', 'اقتراح تحسين محدد لكل مشكلة مرصودة، مرتبط مباشرة بما لوحظ أثناء تنفيذ المهام.')}
    ${card('03', 'ملاحظات فريق المراقبة', 'انطباعات أعضاء الفريق أثناء المراقبة المباشرة: التردد، طلبات المساعدة، وسلوك الاستكشاف.')}
    ${card('04', 'مقارنة الفئتين والاستنتاج', 'مقارنة طلاب الجامعة وطلاب الثانوية في الإكمال والوقت والأخطاء وSUS، ثم الاستنتاج النهائي.')}
  </div>
  <p class="conc-final">${emptyTag()}<br><b>تُستكمل هذه الشريحة فور انتهاء الدراسة الميدانية وإدخال البيانات.</b></p>
  ${foot(10)}
</section>`;
};

export const renderSlides = (m) => [s01(), s02(), s03(m), s04(), s05(m), s06(m), s07(m), s08(m), s09(m), s10()].join('\n');
