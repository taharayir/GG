/* ═══════════════════════════════════════
   habits.js — عادت‌تراکر
═══════════════════════════════════════ */

function getHabits() {
  return JSON.parse(localStorage.getItem('habits') || JSON.stringify(DFLTHBT));
}

function renderHabits() {
  const habits = getHabits();
  const list = document.getElementById('hbtList');
  if (!list) return;
  list.innerHTML = '';

  // weekly summary
  let totalOn = 0, totalPossible = 0;
  habits.forEach(h => {
    const sv = JSON.parse(localStorage.getItem('hb_'+h.id)||'{}');
    for (let di = 0; di < 7; di++) {
      const dd = new Date(); dd.setDate(dd.getDate() - 6 + di);
      totalPossible++;
      if (sv[dd.toDateString()]) totalOn++;
    }
  });

  const pct = totalPossible > 0 ? Math.round(totalOn / totalPossible * 100) : 0;
  const summaryDiv = document.createElement('div');
  summaryDiv.style.cssText = 'background:linear-gradient(145deg,var(--c2),var(--c3));border:1px solid var(--b1);border-radius:20px;padding:18px 20px;margin-bottom:16px;box-shadow:0 4px 22px rgba(0,0,0,.2)';
  summaryDiv.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:11px">
      <span style="font-size:13px;font-weight:800;color:var(--t1)">هفته جاری</span>
      <span style="font-size:22px;font-weight:900;color:var(--pur2);font-family:'Space Grotesk',sans-serif">${pct}٪</span>
    </div>
    <div style="height:7px;background:var(--b2);border-radius:4px;overflow:hidden">
      <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--pur),var(--teal),var(--cyan));border-radius:4px;transition:width 1.2s ease;box-shadow:0 0 13px rgba(124,68,238,.42)"></div>
    </div>
    <div style="font-size:11px;color:var(--t3);margin-top:8px">${totalOn} از ${totalPossible} عادت انجام شده</div>
  `;
  list.appendChild(summaryDiv);

  habits.forEach(h => {
    const sv = JSON.parse(localStorage.getItem('hb_'+h.id)||'{}');
    const div = document.createElement('div');
    div.className = 'hbtcard';

    // streak calculation
    let streak = 0;
    for (let di = 0; di < 7; di++) {
      const dd = new Date(); dd.setDate(dd.getDate() - (6 - di));
      if (sv[dd.toDateString()]) streak++;
      else if (di < 6) streak = 0;
    }

    let daysHTML = '';
    for (let di = 0; di < 7; di++) {
      const dd = new Date(); dd.setDate(dd.getDate() - 6 + di);
      const dk = dd.toDateString();
      const on = sv[dk];
      const dayName = ['ی','د','س','چ','پ','ج','ش'][dd.getDay()];
      daysHTML += `<div style="display:flex;flex-direction:column;align-items:center;gap:3px">
        <span style="font-size:9px;color:var(--t4);font-weight:700">${dayName}</span>
        <div class="hbd${on?' on':''}" onclick="togHabit('${h.id}','${dk}',this)">${on?'✓':''}</div>
      </div>`;
    }

    div.innerHTML = `
      <div class="hbtrow">
        <div class="hbtico">${h.ico}</div>
        <div class="hbtinfo">
          <div class="hbtname">${h.name}</div>
          <div class="hbtsub">${h.sub}${streak>0?' · '+streak+' روز پشت‌سرهم 🔥':''}</div>
        </div>
        <button onclick="delHabit('${h.id}')" style="background:none;border:none;color:var(--t4);cursor:pointer;font-size:17px;padding:4px 8px;transition:color .2s;line-height:1" onmouseover="this.style.color='var(--red2)'" onmouseout="this.style.color='var(--t4)'">✕</button>
      </div>
      <div class="hbdots" style="justify-content:space-between;margin-top:14px">${daysHTML}</div>
    `;
    list.appendChild(div);
  });
}

function togHabit(id, dk, el) {
  const sv = JSON.parse(localStorage.getItem('hb_'+id)||'{}');
  sv[dk] = !sv[dk];
  localStorage.setItem('hb_'+id, JSON.stringify(sv));
  el.classList.toggle('on', !!sv[dk]);
  el.textContent = sv[dk] ? '✓' : '';
  if (sv[dk]) spawnSp(el, '⭐');
  setTimeout(() => renderHabits(), 300);
}

function delHabit(id) {
  const h = getHabits();
  localStorage.setItem('habits', JSON.stringify(h.filter(x => x.id !== id)));
  renderHabits();
}

function openAddHabit() {
  document.getElementById('mTitle').textContent = 'عادت جدید';
  document.getElementById('mBody').innerHTML = `
    <input class="minp" id="mhn" placeholder="نام عادت (مثلاً: مدیتیشن)">
    <input class="minp" id="mhs" placeholder="توضیح کوتاه (اختیاری)">
    <input class="minp" id="mhico" placeholder="ایموجی 🧘" maxlength="4">
    <button class="mprim" onclick="saveHabit()">اضافه کردن</button>
  `;
  openMod();
  setTimeout(() => document.getElementById('mhn').focus(), 200);
}

function saveHabit() {
  const n = document.getElementById('mhn').value.trim();
  const s = document.getElementById('mhs').value.trim();
  const ico = document.getElementById('mhico').value.trim() || '⭐';
  if (!n) return;
  const h = getHabits();
  h.push({id:'h'+Date.now(), name:n, ico, sub:s});
  localStorage.setItem('habits', JSON.stringify(h));
  closeMod();
  renderHabits();
}
