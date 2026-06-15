/* ═══════════════════════════════════════
   app.js — منطق اصلی | نسخه کامل (باگ‌فیکس)
═══════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────
   متغیرهای سراسری
───────────────────────────────────── */
let selI = null;   // روز انتخاب‌شده
let qI   = 0;      // شاخص نقل‌قول فعلی

/* ─────────────────────────────────────
   ناوبری صفحه
───────────────────────────────────── */
function goP(id) {
  document.querySelectorAll('.pg').forEach(p => p.classList.remove('act'));
  document.querySelectorAll('.bni').forEach(b => b.classList.remove('act'));
  const pg = document.getElementById('pg-' + id);
  const bn = document.getElementById('bn-' + id);
  if (pg) pg.classList.add('act');
  if (bn) bn.classList.add('act');
  if (id === 'habit') renderHabits();
  if (id === 'plan')  renderPlan();
}

/* ─────────────────────────────────────
   آب‌نوشی
───────────────────────────────────── */
function buildWater() {
  const cont = document.getElementById('glw');
  if (!cont) return;
  const saved = parseInt(localStorage.getItem('w_' + todayKey()) || '0');
  cont.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const gl = document.createElement('div');
    gl.className = 'gl' + (i < saved ? ' full' : '');
    gl.innerHTML = `<div class="glw" style="height:${i < saved ? '100%' : '0%'}"></div>
                    <div class="gll">💧</div>`;
    gl.onclick = () => setW(i + 1);
    cont.appendChild(gl);
  }
  updWUI(saved);
}

function setW(n) {
  localStorage.setItem('w_' + todayKey(), n);
  buildWater();
  if (n === 8) spawnSp(document.getElementById('glw'), '💧');
}

function updWUI(n) {
  const wn    = document.getElementById('wn');
  const wml   = document.getElementById('wml');
  const wbar  = document.getElementById('wbar');
  const wstat = document.getElementById('wstat');
  if (wn)    wn.textContent    = n;
  if (wml)   wml.textContent   = (n * 250) + ' ml';
  if (wbar)  wbar.style.width  = (n / 8 * 100) + '%';
  if (wstat) wstat.textContent = n >= 8 ? '✅ هدف رسیدی!' : 'هدف: ۸ لیوان';
}

/* ─────────────────────────────────────
   موتور نقل‌قول
───────────────────────────────────── */
function updQ(fade) {
  const q    = QQ[qI];
  const txt  = document.getElementById('qtxt');
  const auth = document.getElementById('qauth');
  const em   = document.getElementById('qem');
  const cnt  = document.getElementById('qcnt');
  const dots = document.getElementById('qdts');
  if (fade && txt) {
    txt.classList.add('fade');
    setTimeout(() => {
      doUpdQ(q, txt, auth, em, cnt, dots);
      txt.classList.remove('fade');
    }, 300);
  } else {
    doUpdQ(q, txt, auth, em, cnt, dots);
  }
}

function doUpdQ(q, txt, auth, em, cnt, dots) {
  if (txt)  txt.textContent  = q.t;
  if (auth) auth.textContent = q.a ? '— ' + q.a : '';
  if (em)   em.textContent   = q.e;
  if (cnt)  cnt.textContent  = (qI + 1) + ' / ' + QQ.length;
  if (dots) {
    dots.innerHTML = '';
    const show = Math.min(QQ.length, 12);
    for (let i = 0; i < show; i++) {
      const d = document.createElement('div');
      d.className = 'qdot' + (i === qI % show ? ' a' : '');
      d.onclick = () => { qI = i; updQ(true); };
      dots.appendChild(d);
    }
  }
}

function chQ(dir)   { qI = (qI + dir + QQ.length) % QQ.length; updQ(true); }
function shuffleQ() { qI = Math.floor(Math.random() * QQ.length); updQ(true); }
setInterval(() => { qI = (qI + 1) % QQ.length; updQ(true); }, 28000);

/* ─────────────────────────────────────
   کمک‌کننده‌های تاریخ
───────────────────────────────────── */
function todayKey() { return new Date().toDateString(); }

function getTodayIndex() {
  const startDate = new Date('2026-06-14');
  const today     = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - startDate) / 86400000);
  return Math.max(0, diff);
}

/* ─────────────────────────────────────
   پیشرفت کلی
───────────────────────────────────── */
function updOverall() {
  const total = getTotalDays();
  let done = 0, gymDone = 0, partyDone = 0;

  for (let i = 0; i < total; i++) {
    if (localStorage.getItem('done_' + i) === '1')       done++;
    if (isGym(i)  && localStorage.getItem('gym_done_'   + i) === '1') gymDone++;
    if (isCafe(i) && localStorage.getItem('party_done_' + i) === '1') partyDone++;
  }

  const pct        = total > 0 ? Math.round(done / total * 100) : 0;
  const rfg        = document.getElementById('rfg');
  const rnum       = document.getElementById('rnum');
  const ovbar      = document.getElementById('ovbar');
  const ovsub      = document.getElementById('ovsub');
  const hCount     = document.getElementById('hCount');
  const gymCount   = document.getElementById('gymCount');
  const cafeCount  = document.getElementById('cafeCount');
  const totalDaysEl= document.getElementById('totalDays');

  if (rfg)      { const c = 2 * Math.PI * 44; rfg.style.strokeDasharray = c; rfg.style.strokeDashoffset = c * (1 - pct / 100); }
  if (rnum)     rnum.innerHTML      = `<span>${pct}٪</span><small>کامل</small>`;
  if (ovbar)    ovbar.style.width   = pct + '%';
  if (ovsub)    ovsub.textContent   = done + ' روز کامل';
  if (hCount)   hCount.textContent  = done;
  if (gymCount) gymCount.textContent= gymDone;
  if (cafeCount)cafeCount.textContent= partyDone;
  if (totalDaysEl) totalDaysEl.textContent = total;
}

/* ─────────────────────────────────────
   تقویم — ساختار ماه‌ها
───────────────────────────────────── */
function buildMonths() {
  const area = document.getElementById('mArea');
  if (!area) return;
  area.innerHTML = '';

  const total      = getTotalDays();
  const todayIdx   = getTodayIndex();
  const monthGroups = [];

  for (let i = 0; i < total; i++) {
    const pd = getPD(i);
    if (!monthGroups.length || monthGroups[monthGroups.length - 1].name !== pd.m) {
      monthGroups.push({ name: pd.m, days: [] });
    }
    monthGroups[monthGroups.length - 1].days.push(i);
  }

  monthGroups.forEach(mg => buildMonth(area, mg.name, mg.days, todayIdx));
}

function buildMonth(wrap, name, days, todayIdx) {
  const sect = document.createElement('div');
  sect.style.marginBottom = '24px';

  const ph = document.createElement('div');
  ph.className = 'mh';
  ph.innerHTML = `<div class="mh-title">${name}</div>
                  <div class="mh-line"></div>
                  <div class="mh-badge">${days.length} روز</div>`;
  sect.appendChild(ph);

  const dowr = document.createElement('div');
  dowr.className = 'dowr';
  DS.forEach(d => {
    const dl = document.createElement('div');
    dl.className  = 'dowl';
    dl.textContent= d;
    dowr.appendChild(dl);
  });
  sect.appendChild(dowr);

  const cal      = document.createElement('div');
  cal.className  = 'cal';
  const firstDow = gDow(days[0]);

  for (let e = 0; e < firstDow; e++) {
    const emp = document.createElement('div');
    emp.className = 'day emp';
    cal.appendChild(emp);
  }

  days.forEach(i => {
    const pd      = getPD(i);
    const gym     = isGym(i);
    const party   = isCafe(i);
    const done    = localStorage.getItem('done_' + i) === '1';
    const isToday = i === todayIdx;
    const isPast  = i < todayIdx;

    const d = document.createElement('div');
    let cls = 'day';
    if (gym && !party) cls += ' gym';
    if (party)         cls += ' cafe';
    if (done)          cls += ' done';
    if (i === selI)    cls += ' sel';
    if (isToday)       cls += ' today';
    if (isPast && !done) cls += ' past';
    d.className = cls;

    const glow = document.createElement('div'); glow.className = 'dglow'; d.appendChild(glow);
    const dn   = document.createElement('div'); dn.className   = 'dn';    dn.textContent = pd.d; d.appendChild(dn);

    if (isToday) {
      const dot = document.createElement('div');
      dot.style.cssText = 'font-size:6px;text-align:center;color:var(--gold);line-height:1';
      dot.textContent   = '●';
      d.appendChild(dot);
    }

    const ddots = document.createElement('div');
    ddots.className = 'ddots';
    if (gym)   { const dot = document.createElement('div'); dot.className = 'ddot'; dot.style.background = 'var(--blue)'; ddots.appendChild(dot); }
    if (party) { const dot = document.createElement('div'); dot.className = 'ddot'; dot.style.background = 'var(--pur)';  ddots.appendChild(dot); }
    if (done)  { const dot = document.createElement('div'); dot.className = 'ddot'; dot.style.background = 'var(--grn)';  ddots.appendChild(dot); }
    d.appendChild(ddots);

    d.onclick = () => selDay(i);
    cal.appendChild(d);
  });

  sect.appendChild(cal);
  wrap.appendChild(sect);
}

/* ─────────────────────────────────────
   انتخاب روز و نمایش جزئیات
───────────────────────────────────── */
function selDay(i) {
  selI = i;
  buildMonths();
  renderDet(i);
  const panel = document.getElementById('detPanel');
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderDet(i) {
  const panel = document.getElementById('detPanel');
  if (!panel) return;
  panel.innerHTML = '';

  const pd       = getPD(i);
  const dow      = gDow(i);
  const gym      = isGym(i);
  const party    = isCafe(i);
  const isDone   = localStorage.getItem('done_'  + i) === '1';
  const gymDone  = localStorage.getItem('gym_done_'   + i) === '1';
  const partyDone= localStorage.getItem('party_done_' + i) === '1';
  const tip      = TIPS[i % TIPS.length];
  const note     = localStorage.getItem('note_' + i) || '';
  const todayIdx = getTodayIndex();
  const isToday  = i === todayIdx;

  const det = document.createElement('div');
  det.className = 'det';

  const cover = document.createElement('div');
  cover.className = 'dcover';
  cover.style.background = 'linear-gradient(135deg,rgba(124,68,238,.2),rgba(46,110,245,.15),rgba(20,184,168,.1))';
  det.appendChild(cover);

  const dtop = document.createElement('div');
  dtop.className = 'dtop';
  const dr1 = document.createElement('div');
  dr1.className = 'dr1';

  const ddate  = document.createElement('div'); ddate.className  = 'ddate'; ddate.textContent = pd.d + ' ' + pd.m;
  const dday   = document.createElement('div'); dday.className   = 'dday';
  dday.innerHTML = DN[dow] + (isToday ? ' · <span style="color:var(--gold)">امروز</span>' : '');
  const dtags  = document.createElement('div'); dtags.className  = 'dtags';

  const gymTagBtn = _makeTagBtn({
    active:   gym,
    done:     gymDone,
    emoji:    '🏋️',
    label:    'باشگاه',
    cls:      'tgy',
    onAdd:    () => localStorage.setItem('is_gym_' + i, '1'),
    onToggle: () => {
      const cur = localStorage.getItem('gym_done_' + i) === '1';
      localStorage.setItem('gym_done_' + i, cur ? '0' : '1');
      if (!cur) spawnSp(det, '💪');
    },
    onRemove: () => localStorage.setItem('is_gym_' + i, '0'),
    refresh:  () => { updOverall(); buildMonths(); renderDet(i); }
  });
  dtags.appendChild(gymTagBtn);

  const partyTagBtn = _makeTagBtn({
    active:   party,
    done:     partyDone,
    emoji:    '🎉',
    label:    'خوشگذرونی',
    cls:      'tca',
    onAdd:    () => localStorage.setItem('is_party_' + i, '1'),
    onToggle: () => {
      const cur = localStorage.getItem('party_done_' + i) === '1';
      localStorage.setItem('party_done_' + i, cur ? '0' : '1');
      if (!cur) spawnSp(det, '🎉');
    },
    onRemove: () => localStorage.setItem('is_party_' + i, '0'),
    refresh:  () => { updOverall(); buildMonths(); renderDet(i); }
  });
  dtags.appendChild(partyTagBtn);

  if (isDone) {
    const donTag = document.createElement('span');
    donTag.className = 'dtag';
    donTag.style.cssText = 'background:rgba(34,201,104,.12);color:var(--grn);border-color:rgba(34,201,104,.28)';
    donTag.textContent = '✅ روز کامل';
    dtags.appendChild(donTag);
  }

  dr1.appendChild(ddate); dr1.appendChild(dday); dr1.appendChild(dtags);
  dtop.appendChild(dr1);
  det.appendChild(dtop);

  const tbar   = document.createElement('div');
  tbar.className = 'tbar';

  const addBtn = document.createElement('button');
  addBtn.className   = 'tbtn';
  addBtn.textContent = '+ اضافه کردن برنامه';
  addBtn.onclick     = () => togAddRow(i);
  tbar.appendChild(addBtn);

  if (gym) {
    const gymPlanBtn   = document.createElement('button');
    gymPlanBtn.className   = 'tbtn tgy2';
    gymPlanBtn.textContent = '💪 برنامه باشگاه';
    gymPlanBtn.onclick     = () => openGymPlan(i);
    tbar.appendChild(gymPlanBtn);
  }

  const shareBtn   = document.createElement('button');
  shareBtn.className   = 'tbtn';
  shareBtn.textContent = '📤 اشتراک';
  shareBtn.onclick     = () => shareDay(i);
  tbar.appendChild(shareBtn);
  det.appendChild(tbar);

  const body  = document.createElement('div');
  body.className = 'dbody';

  body.appendChild(_buildPlanCol(i, gym, det));
  body.appendChild(_buildCheckCol(i, tip, note, isDone));

  det.appendChild(body);

  const closeBtn = document.createElement('div');
  closeBtn.style.cssText = 'padding:12px 24px;text-align:center;border-top:1px solid var(--b1);cursor:pointer;color:var(--t3);font-size:12px;font-weight:700;transition:color .2s';
  closeBtn.textContent   = '✕ بستن';
  closeBtn.onclick       = () => { panel.style.display = 'none'; selI = null; buildMonths(); };
  closeBtn.onmouseover   = () => closeBtn.style.color = 'var(--t1)';
  closeBtn.onmouseout    = () => closeBtn.style.color = 'var(--t3)';
  det.appendChild(closeBtn);

  panel.appendChild(det);
}

/* ─────────────────────────────────────
   سازنده تگ با hold برای حذف
───────────────────────────────────── */
function _makeTagBtn({ active, done, emoji, label, cls, onAdd, onToggle, onRemove, refresh }) {
  const btn    = document.createElement('span');
  btn.className= 'dtag ' + (active ? cls : '');
  btn.style.cssText = 'cursor:pointer;opacity:' + (active ? '1' : '.45');
  btn.textContent   = (active ? (done ? '✅' : emoji) : emoji) + ' ' + label;
  btn.title         = active ? 'کلیک: انجام شد · نگه‌دار: حذف' : 'کلیک: فعال کن';

  let timer = null;
  const down = () => { timer = setTimeout(() => { onRemove(); refresh(); }, 700); };
  const up   = () => clearTimeout(timer);
  const click= () => { clearTimeout(timer); if (!active) onAdd(); else onToggle(); refresh(); };

  btn.onmousedown  = down;
  btn.ontouchstart = down;
  btn.onmouseup    = up;
  btn.ontouchend   = up;
  btn.onclick      = click;
  return btn;
}

/* ─────────────────────────────────────
   ستون چپ: برنامه روز
───────────────────────────────────── */
function _buildPlanCol(i, gym, detEl) {
  const left  = document.createElement('div');
  left.className = 'dcol';

  const lHead = document.createElement('div'); lHead.className = 'dch'; lHead.textContent = '📋 برنامه روز';
  const lSub  = document.createElement('div');
  lSub.style.cssText = 'font-size:11px;color:var(--t3);margin-top:-8px;margin-bottom:12px';
  lSub.textContent   = 'آیتم‌هات رو با ساعت و ایموجی بساز';
  left.appendChild(lHead);
  left.appendChild(lSub);

  const arow    = document.createElement('div');
  arow.className= 'arow';
  arow.id       = 'arow_' + i;
  arow.innerHTML= `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px">
      <input class="ainp" id="anew_e_${i}"    placeholder="ایموجی 🎯" style="text-align:center;font-size:18px">
      <input class="ainp" id="anew_time_${i}" placeholder="ساعت (مثلاً ۸:۰۰)">
    </div>
    <input class="ainp" id="anew_t_${i}" placeholder="عنوان کار...">
    <input class="ainp" id="anew_s_${i}" placeholder="توضیح (اختیاری)">
    <div class="arbtns">
      <button class="addbtn" onclick="addItem(${i})">اضافه کن</button>
      <button class="ccl"    onclick="togAddRow(${i})">انصراف</button>
    </div>`;
  left.appendChild(arow);

  /* ── FIX: آیتم‌های برنامه رو مستقیم از getSched می‌گیریم ── */
  const { L } = getSched(i);

  if (L.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'text-align:center;padding:24px;color:var(--t4);font-size:12px';
    empty.innerHTML = '📝 هنوز آیتمی نداری<br><span style="font-size:10px">دکمه + اضافه کردن برنامه بزن</span>';
    left.appendChild(empty);
  } else {
    /* FIX: ایندکس k دقیقاً همونیه که در localStorage ذخیره می‌شه */
    L.forEach((item, k) => {
      left.appendChild(_makePlanRow(i, k, item));
    });
  }

  if (gym) {
    const gymPlan = JSON.parse(localStorage.getItem('gym_plan_' + i) || '[]');
    if (gymPlan.length > 0) {
      const gd   = document.createElement('div'); gd.className   = 'gmd';
      const gmdt = document.createElement('div'); gmdt.className = 'gmdt'; gmdt.textContent = '💪 برنامه باشگاه';
      const gmdg = document.createElement('div'); gmdg.className = 'gmdg';
      gymPlan.forEach(ex => {
        const gmdm = document.createElement('div'); gmdm.className = 'gmdm';
        gmdm.textContent = (ex.time ? ex.time + ' · ' : '') + ex.name + (ex.sets ? ' — ' + ex.sets : '');
        gmdg.appendChild(gmdm);
      });
      gd.appendChild(gmdt); gd.appendChild(gmdg);
      left.appendChild(gd);
    }
  }

  return left;
}

/* ─────────────────────────────────────
   ردیف آیتم برنامه
   FIX: ایندکس k مستقیم از L می‌آد (نه offset)
        حذف هم بر همین اساس کار می‌کنه
───────────────────────────────────── */
function _makePlanRow(i, k, item) {
  const isDoneItem = localStorage.getItem('tb_' + i + '_' + k) === '1';

  const tb  = document.createElement('div');
  tb.className = 'tb' + (isDoneItem ? ' ck' : '');
  tb.id = 'tb_' + i + '_' + k;

  /* FIX: دکمه تیک با closure درست */
  const tbc = document.createElement('div');
  tbc.className   = 'tbc';
  tbc.id          = 'tbc_' + i + '_' + k;
  tbc.textContent = isDoneItem ? '✓' : '';
  tbc.onclick     = (function(dayIdx, itemIdx) {
    return function() { togTB(dayIdx, itemIdx, this); };
  })(i, k);

  const tbi = document.createElement('div');
  tbi.className = 'tbi';

  if (item.time || item.e) {
    const tt = document.createElement('div');
    tt.className   = 'ttime';
    tt.textContent = (item.e ? item.e + ' ' : '') + (item.time || '');
    tbi.appendChild(tt);
  }

  const tbt = document.createElement('div'); tbt.className = 'tbt'; tbt.textContent = item.t;
  tbi.appendChild(tbt);

  if (item.s) {
    const tbs = document.createElement('div'); tbs.className = 'tbs'; tbs.textContent = item.s;
    tbi.appendChild(tbs);
  }

  /* FIX: دکمه حذف — ایندکس k مستقیم */
  const delbtn   = document.createElement('button');
  delbtn.className   = 'delbtn';
  delbtn.textContent = '✕';
  delbtn.title       = 'حذف این آیتم';
  delbtn.onclick     = (function(dayIdx, itemIdx) {
    return function(e) {
      e.stopPropagation();
      if (confirm('این آیتم حذف بشه؟')) delItem(dayIdx, itemIdx);
    };
  })(i, k);

  tb.appendChild(tbc); tb.appendChild(tbi); tb.appendChild(delbtn);
  return tb;
}

/* ─────────────────────────────────────
   ستون راست: چک‌لیست
───────────────────────────────────── */
function _buildCheckCol(i, tip, note, isDone) {
  const right = document.createElement('div');
  right.className = 'dcol';

  const rHead = document.createElement('div'); rHead.className = 'dch'; rHead.textContent = '✅ چک‌لیست روز';
  right.appendChild(rHead);

  const { L } = getSched(i);
  const totalItems = L.length;
  let doneItems = 0;
  for (let k = 0; k < totalItems; k++) {
    if (localStorage.getItem('tb_' + i + '_' + k) === '1') doneItems++;
  }
  const dayPct = totalItems > 0 ? Math.round(doneItems / totalItems * 100) : 0;

  const dpcard = document.createElement('div');
  dpcard.className = 'dpcard';
  dpcard.id = 'dpcard_' + i;
  dpcard.innerHTML = `
    <div class="dprow">
      <span>پیشرفت امروز</span>
      <span class="dppct" id="daypct_${i}">${dayPct}٪</span>
    </div>
    <div class="dptr"><div class="dpbar" id="daybar_${i}" style="width:${dayPct}%"></div></div>`;
  right.appendChild(dpcard);

  const cr             = JSON.parse(localStorage.getItem('cr_' + i) || '[]');
  const checklistWrap  = document.createElement('div');
  checklistWrap.id     = 'checklist_' + i;

  if (cr.length === 0) {
    const emp = document.createElement('div');
    emp.style.cssText   = 'text-align:center;padding:16px;color:var(--t4);font-size:12px';
    emp.innerHTML       = '📋 چک‌لیست خالیه<br><span style="font-size:10px">آیتم اضافه کن</span>';
    checklistWrap.appendChild(emp);
  } else {
    cr.forEach((item, k) => {
      /* FIX: closure درست برای هر ردیف */
      checklistWrap.appendChild(_makeCheckRow(i, k, item));
    });
  }
  right.appendChild(checklistWrap);

  const addCheckRow = document.createElement('div');
  addCheckRow.className = 'add-check-row';

  const ckInp   = document.createElement('input');
  ckInp.className   = 'ainp';
  ckInp.id          = 'ck_new_' + i;
  ckInp.placeholder = '+ آیتم چک‌لیست...';
  ckInp.onkeydown   = (e) => { if (e.key === 'Enter') addCheckItem(i); };

  const ckBtn   = document.createElement('button');
  ckBtn.className   = 'addbtn';
  ckBtn.style.cssText = 'margin-top:6px;width:100%';
  ckBtn.textContent = 'اضافه کن';
  ckBtn.onclick     = () => addCheckItem(i);

  addCheckRow.appendChild(ckInp);
  addCheckRow.appendChild(ckBtn);
  right.appendChild(addCheckRow);

  const tipcard = document.createElement('div');
  tipcard.className = 'tipcard';
  tipcard.innerHTML = `<div class="tiph">💡 نکته روز</div><div class="tipb">${tip}</div>`;
  right.appendChild(tipcard);

  const ntHead = document.createElement('div');
  ntHead.className   = 'dch';
  ntHead.style.marginTop = '14px';
  ntHead.textContent = 'یادداشت';
  right.appendChild(ntHead);

  const ntarea = document.createElement('textarea');
  ntarea.className   = 'ntarea';
  ntarea.placeholder = 'یادداشت‌های امروزت...';
  ntarea.value       = note;
  ntarea.oninput     = () => localStorage.setItem('note_' + i, ntarea.value);
  right.appendChild(ntarea);

  const donebtn = document.createElement('button');
  donebtn.className   = 'donebtn ' + (isDone ? 'on' : 'off');
  donebtn.id          = 'donebtn_' + i;
  donebtn.textContent = isDone ? '✅ روز کامل شد!' : '✓ روز رو کامل کن';
  donebtn.onclick     = () => togDone(i);
  right.appendChild(donebtn);

  return right;
}

/* ─────────────────────────────────────
   ردیف آیتم چک‌لیست
   FIX: closure درست + ID یکتا برای هر ردیف
───────────────────────────────────── */
function _makeCheckRow(i, k, rawItem) {
  const parts  = rawItem.split('|');
  const txt    = parts[0] || rawItem;
  const sub    = parts[1] || '';
  const isDone = localStorage.getItem('rc_' + i + '_' + k) === '1';

  const pi  = document.createElement('div');
  pi.className = 'tb' + (isDone ? ' ck' : '');
  pi.id = 'rc_row_' + i + '_' + k;   /* FIX: پیشوند row_ تا با tbc تداخل نداشته باشه */

  const tbc2 = document.createElement('div');
  tbc2.className   = 'tbc';
  tbc2.id          = 'rc_tbc_' + i + '_' + k;
  tbc2.textContent = isDone ? '✓' : '';
  /* FIX: closure درست */
  tbc2.onclick     = (function(dayIdx, itemIdx) {
    return function() { togRC(dayIdx, itemIdx, this); };
  })(i, k);

  const tbi2 = document.createElement('div');
  tbi2.className = 'tbi';
  const tbt2 = document.createElement('div'); tbt2.className = 'tbt'; tbt2.textContent = txt;
  tbi2.appendChild(tbt2);
  if (sub) {
    const tbs2 = document.createElement('div'); tbs2.className = 'tbs'; tbs2.textContent = sub;
    tbi2.appendChild(tbs2);
  }

  /* FIX: closure درست برای حذف */
  const del2   = document.createElement('button');
  del2.className   = 'delbtn';
  del2.textContent = '✕';
  del2.title       = 'حذف این آیتم';
  del2.onclick     = (function(dayIdx, itemIdx) {
    return function(e) {
      e.stopPropagation();
      if (confirm('این آیتم از چک‌لیست حذف بشه؟')) delCheckItem(dayIdx, itemIdx);
    };
  })(i, k);

  pi.appendChild(tbc2); pi.appendChild(tbi2); pi.appendChild(del2);
  return pi;
}

/* ─────────────────────────────────────
   مودال برنامه باشگاه
───────────────────────────────────── */
function openGymPlan(i) {
  document.getElementById('mTitle').textContent = '💪 برنامه باشگاه';
  const body = document.getElementById('mBody');
  body.innerHTML = '';

  const listDiv = document.createElement('div');
  listDiv.id    = 'gym_list';
  body.appendChild(listDiv);
  _renderGymList(i);

  const formDiv = document.createElement('div');
  formDiv.style.cssText = 'margin-top:12px;padding-top:12px;border-top:1px solid var(--b1)';
  formDiv.innerHTML = `
    <input class="minp" id="gex_name" placeholder="نام تمرین (مثلاً: اسکوات)">
    <input class="minp" id="gex_sets" placeholder="ست‌ها (مثلاً: ۴×۱۰)">
    <input class="minp" id="gex_time" placeholder="ساعت (اختیاری)">
    <button class="mprim" onclick="addGymExercise(${i})">+ اضافه کن</button>`;
  body.appendChild(formDiv);

  openMod();
}

function _renderGymList(i) {
  const list = document.getElementById('gym_list');
  if (!list) return;
  list.innerHTML = '';
  const gp = JSON.parse(localStorage.getItem('gym_plan_' + i) || '[]');

  if (gp.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:16px;color:var(--t4);font-size:12px">💪 هنوز تمرینی نداری</div>';
    return;
  }

  gp.forEach((ex, k) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px;background:var(--c3);border-radius:10px;margin-bottom:6px';

    const txt = document.createElement('div');
    txt.style.flex     = '1';
    txt.style.fontSize = '13px';
    txt.innerHTML = `<strong>${ex.name}</strong>
      ${ex.sets ? '<br><span style="font-size:10px;color:var(--t3)">' + ex.sets + '</span>' : ''}
      ${ex.time ? '<br><span style="font-size:10px;color:var(--teal)">' + ex.time + '</span>' : ''}`;

    const del = document.createElement('button');
    del.className   = 'delbtn';
    del.textContent = '✕';
    del.onclick     = (function(dayIdx, exIdx) {
      return function() {
        const gp2 = JSON.parse(localStorage.getItem('gym_plan_' + dayIdx) || '[]');
        gp2.splice(exIdx, 1);
        localStorage.setItem('gym_plan_' + dayIdx, JSON.stringify(gp2));
        _renderGymList(dayIdx);
      };
    })(i, k);

    row.appendChild(txt); row.appendChild(del);
    list.appendChild(row);
  });
}

function addGymExercise(i) {
  const name = document.getElementById('gex_name');
  const sets = document.getElementById('gex_sets');
  const time = document.getElementById('gex_time');
  if (!name || !name.value.trim()) return;

  const gp = JSON.parse(localStorage.getItem('gym_plan_' + i) || '[]');
  gp.push({
    name: name.value.trim(),
    sets: sets ? sets.value.trim() : '',
    time: time ? time.value.trim() : ''
  });
  localStorage.setItem('gym_plan_' + i, JSON.stringify(gp));

  if (name) name.value = '';
  if (sets) sets.value = '';
  if (time) time.value = '';

  _renderGymList(i);
}

/* ─────────────────────────────────────
   مدیریت آیتم‌های برنامه روز
   FIX: delItem دیگه offset ثابت نداره — ایندکس مستقیمه
───────────────────────────────────── */
function togAddRow(i) {
  const arow = document.getElementById('arow_' + i);
  if (arow) arow.classList.toggle('show');
}

function addItem(i) {
  const t    = document.getElementById('anew_t_'    + i);
  const s    = document.getElementById('anew_s_'    + i);
  const e    = document.getElementById('anew_e_'    + i);
  const time = document.getElementById('anew_time_' + i);
  if (!t || !t.value.trim()) return;

  const ct     = JSON.parse(localStorage.getItem('ct_' + i) || '[]');
  const emoji  = (e && e.value.trim())    || '📌';
  const timeV  = (time && time.value.trim()) || '';
  ct.push(t.value.trim() + '|' + (s ? s.value.trim() : '') + '|' + timeV + '|' + emoji);
  localStorage.setItem('ct_' + i, JSON.stringify(ct));

  if (t)    t.value    = '';
  if (s)    s.value    = '';
  if (e)    e.value    = '';
  if (time) time.value = '';

  renderDet(i);
}

/* FIX: delItem دیگه staticCount نداره
   getSched باید L رو برگردونه که آیتم‌ها دقیقاً با ایندکس k ذخیره‌شده همخوانی داشته باشن
   اگه getSched آیتم‌های ثابت رو هم داخل L می‌ذاره، باید خودت offset رو بدونی
   اینجا فرض می‌کنیم ct_ فقط آیتم‌های کاربر رو داره و ایندکس‌شون از ۰ شروع می‌شه */
function delItem(i, k) {
  const ct = JSON.parse(localStorage.getItem('ct_' + i) || '[]');

  /* FIX: اگه getSched آیتم‌های ثابت (gym/cafe) هم داخل L داره،
     باید offset رو کم کنیم. وگرنه k مستقیم استفاده می‌شه */
  const gym         = isGym(i);
  const party       = isCafe(i);
  const staticCount = (gym ? 1 : 0) + (party ? 1 : 0);
  const ctIdx       = k - staticCount;

  if (ctIdx < 0 || ctIdx >= ct.length) return; /* آیتم ثابت یا خارج از محدوده */

  ct.splice(ctIdx, 1);
  localStorage.setItem('ct_' + i, JSON.stringify(ct));

  /* FIX: تیک آیتم حذف‌شده رو پاک و بقیه رو shift کن */
  localStorage.removeItem('tb_' + i + '_' + k);
  /* shift کردن تیک‌های بعدی */
  const { L } = getSched(i); /* بعد از حذف، L جدیده */
  for (let j = k; j < L.length + staticCount; j++) {
    const nextVal = localStorage.getItem('tb_' + i + '_' + (j + 1));
    if (nextVal !== null) {
      localStorage.setItem('tb_' + i + '_' + j, nextVal);
    } else {
      localStorage.removeItem('tb_' + i + '_' + j);
    }
  }

  renderDet(i);
}

/* ─────────────────────────────────────
   مدیریت چک‌لیست
   FIX: delCheckItem — shift درست
───────────────────────────────────── */
function addCheckItem(i) {
  const inp = document.getElementById('ck_new_' + i);
  if (!inp || !inp.value.trim()) return;

  const cr = JSON.parse(localStorage.getItem('cr_' + i) || '[]');
  cr.push(inp.value.trim());
  localStorage.setItem('cr_' + i, JSON.stringify(cr));
  inp.value = '';
  renderDet(i);
}

function delCheckItem(i, k) {
  const cr = JSON.parse(localStorage.getItem('cr_' + i) || '[]');
  if (k < 0 || k >= cr.length) return;

  cr.splice(k, 1);
  localStorage.setItem('cr_' + i, JSON.stringify(cr));

  /* FIX: shift کردن درست — تا cr.length (بعد از splice) نه cr.length+1 */
  for (let j = k; j < cr.length; j++) {
    const nextVal = localStorage.getItem('rc_' + i + '_' + (j + 1));
    if (nextVal !== null) {
      localStorage.setItem('rc_' + i + '_' + j, nextVal);
    } else {
      localStorage.removeItem('rc_' + i + '_' + j);
    }
  }
  /* آخرین آیتم رو هم پاک کن */
  localStorage.removeItem('rc_' + i + '_' + cr.length);

  renderDet(i);
}

/* ─────────────────────────────────────
   تیک‌زنی آیتم‌های برنامه
───────────────────────────────────── */
function togTB(i, k, el) {
  const cur = localStorage.getItem('tb_' + i + '_' + k) === '1';
  localStorage.setItem('tb_' + i + '_' + k, cur ? '0' : '1');

  const row = document.getElementById('tb_' + i + '_' + k);
  if (row) row.classList.toggle('ck', !cur);
  el.textContent = cur ? '' : '✓';

  if (!cur) {
    el.classList.add('pop');
    spawnSp(el, '✅');
    setTimeout(() => el.classList.remove('pop'), 500);
  }
  updDayProgress(i);
}

/* ─────────────────────────────────────
   تیک‌زنی آیتم‌های چک‌لیست
   FIX: ID المان با پیشوند rc_row_ اصلاح شده
───────────────────────────────────── */
function togRC(i, k, el) {
  const cur = localStorage.getItem('rc_' + i + '_' + k) === '1';
  localStorage.setItem('rc_' + i + '_' + k, cur ? '0' : '1');

  /* FIX: ID ردیف rc_row_ هست نه rc_ */
  const row = document.getElementById('rc_row_' + i + '_' + k);
  if (row) row.classList.toggle('ck', !cur);
  el.textContent = cur ? '' : '✓';

  if (!cur) {
    el.classList.add('pop');
    spawnSp(el, '⭐');
    setTimeout(() => el.classList.remove('pop'), 500);
  }
}

/* ─────────────────────────────────────
   بروزرسانی نوار پیشرفت روز
───────────────────────────────────── */
function updDayProgress(i) {
  const { L } = getSched(i);
  const total  = L.length;
  let done     = 0;
  for (let k = 0; k < total; k++) {
    if (localStorage.getItem('tb_' + i + '_' + k) === '1') done++;
  }
  const pct  = total > 0 ? Math.round(done / total * 100) : 0;
  const pbar = document.getElementById('daybar_' + i);
  const ppct = document.getElementById('daypct_' + i);
  if (pbar) pbar.style.width    = pct + '%';
  if (ppct) ppct.textContent    = pct + '٪';
}

/* ─────────────────────────────────────
   کامل کردن روز
───────────────────────────────────── */
function togDone(i) {
  const cur = localStorage.getItem('done_' + i) === '1';
  localStorage.setItem('done_' + i, cur ? '0' : '1');

  const btn = document.getElementById('donebtn_' + i);
  if (btn) {
    btn.className   = 'donebtn ' + (cur ? 'off' : 'on');
    btn.textContent = cur ? '✓ روز رو کامل کن' : '✅ روز کامل شد!';
  }
  if (!cur) spawnConf(btn || document.body);
  updOverall();
  buildMonths();
}

/* ─────────────────────────────────────
   اشتراک‌گذاری روز
───────────────────────────────────── */
function shareDay(i) {
  const pd   = getPD(i);
  const text = `روز ${i + 1} — ${pd.d} ${pd.m} 🔥 #پلن_من`;
  if (navigator.share) {
    navigator.share({ title: 'پلن من', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => alert('کپی شد!'));
  }
}

/* ─────────────────────────────────────
   شمارنده معکوس (با ثانیه)
───────────────────────────────────── */
function startCD() {
  function u() {
    const n  = new Date();
    const t  = new Date('2027-03-01T00:00:00');
    const df = t - n;
    if (df <= 0) return;
    const cdd = document.getElementById('cdd');
    const cdh = document.getElementById('cdh');
    const cdm = document.getElementById('cdm');
    const cds = document.getElementById('cds');
    if (cdd) cdd.textContent = Math.floor(df / 864e5);
    if (cdh) cdh.textContent = Math.floor(df % 864e5 / 36e5);
    if (cdm) cdm.textContent = Math.floor(df % 36e5  / 6e4);
    if (cds) cds.textContent = Math.floor(df % 6e4   / 1000);
  }
  u();
  setInterval(u, 1000);
}

/* ─────────────────────────────────────
   تنظیمات: خروجی / ورودی / ریست
───────────────────────────────────── */
function exportData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    data[k] = localStorage.getItem(k);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'myplan-backup.json';
  a.click();
}

function importData() {
  const inp    = document.createElement('input');
  inp.type     = 'file';
  inp.accept   = '.json';
  inp.onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload  = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        Object.keys(d).forEach(k => localStorage.setItem(k, d[k]));
        if (confirm('بکاپ بازیابی شد! صفحه رفرش بشه؟')) location.reload();
      } catch (err) { alert('فایل نامعتبر'); }
    };
    r.readAsText(f);
  };
  inp.click();
}

function resetAll() {
  if (confirm('همه داده‌ها پاک بشن؟') && confirm('مطمئنی؟ برگشتی نیست!')) {
    localStorage.clear();
    location.reload();
  }
}

/* ─────────────────────────────────────
   مودال عمومی
───────────────────────────────────── */
function openMod() {
  document.getElementById('modalBg').classList.add('open');
}

function closeMod(e) {
  if (!e || e.target === document.getElementById('modalBg')) {
    document.getElementById('modalBg').classList.remove('open');
  }
}

/* ─────────────────────────────────────
   افکت کج‌شدن کارت‌ها
───────────────────────────────────── */
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ─────────────────────────────────────
   راه‌اندازی اولیه
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildWater();
  buildMonths();
  updOverall();
  updQ(false);
  startCD();
  initCanvas();
  initTilt();

  setInterval(() => {
    const dots = document.getElementById('qdts');
    if (dots) {
      dots.querySelectorAll('.qdot').forEach((d, i) => {
        d.classList.toggle('a', i === qI % Math.min(QQ.length, 12));
      });
    }
  }, 1000);
});
