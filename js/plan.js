/* ═══════════════════════════════════════
   plan.js — برنامه‌ریز شخصی
═══════════════════════════════════════ */

function getPlanB() {
  return JSON.parse(localStorage.getItem('planBlocks') || JSON.stringify(DFLTPLAN));
}

function renderPlan() {
  const blocks = getPlanB();
  const wrap = document.getElementById('planBlocks');
  if (!wrap) return;
  wrap.innerHTML = '';

  blocks.forEach(b => {
    const div = document.createElement('div');
    div.className = 'planb';

    const doneCount = b.items.filter(x => x.done).length;
    const totalCount = b.items.length;
    const pctBar = totalCount > 0 ? Math.round(doneCount / totalCount * 100) : 0;

    // header
    const header = document.createElement('div');
    header.className = 'planbt';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = b.title;
    titleSpan.style.cursor = 'pointer';
    titleSpan.onclick = () => editBTitle(b.id);
    header.appendChild(titleSpan);

    const rightSide = document.createElement('div');
    rightSide.style.cssText = 'display:flex;align-items:center;gap:8px';
    if (totalCount > 0) {
      const cnt = document.createElement('span');
      cnt.style.cssText = "font-size:10px;color:var(--t3);font-family:'Space Grotesk',sans-serif";
      cnt.textContent = doneCount + '/' + totalCount;
      rightSide.appendChild(cnt);
    }
    const delBtn = document.createElement('button');
    delBtn.style.cssText = 'background:none;border:none;color:var(--t4);cursor:pointer;font-size:14px;line-height:1;transition:color .2s';
    delBtn.textContent = '✕';
    delBtn.onmouseover = () => delBtn.style.color = 'var(--red2)';
    delBtn.onmouseout = () => delBtn.style.color = 'var(--t4)';
    delBtn.onclick = () => delBlock(b.id);
    rightSide.appendChild(delBtn);
    header.appendChild(rightSide);
    div.appendChild(header);

    // progress bar
    if (totalCount > 0) {
      const pbar = document.createElement('div');
      pbar.style.cssText = 'height:3px;background:var(--b1);border-radius:2px;overflow:hidden;margin-bottom:12px';
      pbar.innerHTML = `<div style="height:100%;width:${pctBar}%;background:linear-gradient(90deg,var(--grn),var(--teal));transition:width .6s ease"></div>`;
      div.appendChild(pbar);
    }

    // items
    const itemsWrap = document.createElement('div');
    itemsWrap.id = 'pitems_' + b.id;

    b.items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'plani' + (it.done ? ' ck' : '');
      row.id = 'pi_' + it.id;

      const chk = document.createElement('div');
      chk.className = 'pichk';
      chk.textContent = it.done ? '✓' : '';
      chk.onclick = () => togPI(b.id, it.id);

      const info = document.createElement('div');
      info.className = 'piinfo';
      info.onclick = () => togPI(b.id, it.id);

      const hasTime = it.time && it.time.trim();
      const hasEmoji = it.emoji && it.emoji.trim();
      if (hasTime || hasEmoji) {
        const meta = document.createElement('div');
        meta.className = 'pi-meta';
        if (hasEmoji) {
          const em = document.createElement('span');
          em.className = 'pi-emoji';
          em.textContent = it.emoji;
          meta.appendChild(em);
        }
        if (hasTime) {
          const tm = document.createElement('span');
          tm.className = 'pi-time';
          tm.textContent = it.time;
          meta.appendChild(tm);
        }
        info.appendChild(meta);
      }

      const txt = document.createElement('div');
      txt.className = 'pitxt';
      txt.textContent = it.text;
      info.appendChild(txt);

      if (it.note && it.note.trim()) {
        const nt = document.createElement('div');
        nt.className = 'pi-note';
        nt.textContent = it.note;
        info.appendChild(nt);
      }

      const del = document.createElement('button');
      del.className = 'pidel';
      del.textContent = '✕';
      del.onclick = (e) => { e.stopPropagation(); delPI(b.id, it.id); };

      row.appendChild(chk);
      row.appendChild(info);
      row.appendChild(del);
      itemsWrap.appendChild(row);
    });

    div.appendChild(itemsWrap);

    // add row
    const addRow = document.createElement('div');
    addRow.className = 'plan-add-row';

    const row1 = document.createElement('div');
    row1.style.cssText = 'display:grid;grid-template-columns:60px 1fr;gap:6px;margin-bottom:6px';
    const emojiInp = document.createElement('input');
    emojiInp.className = 'planinp pi-emoji-inp';
    emojiInp.placeholder = '🎯';
    emojiInp.style.cssText = 'text-align:center;font-size:16px';
    emojiInp.id = 'pe_' + b.id;
    const titleInp = document.createElement('input');
    titleInp.className = 'planinp';
    titleInp.placeholder = '+ کار جدید...';
    titleInp.id = 'pt_' + b.id;
    titleInp.onkeydown = (e) => { if (e.key === 'Enter') addPI(b.id); };
    row1.appendChild(emojiInp);
    row1.appendChild(titleInp);
    addRow.appendChild(row1);

    const row2 = document.createElement('div');
    row2.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px';
    const timeInp = document.createElement('input');
    timeInp.className = 'planinp';
    timeInp.placeholder = '⏰ ساعت (مثلاً ۸:۳۰)';
    timeInp.id = 'ptime_' + b.id;
    const noteInp = document.createElement('input');
    noteInp.className = 'planinp';
    noteInp.placeholder = '📝 توضیح';
    noteInp.id = 'pnote_' + b.id;
    row2.appendChild(timeInp);
    row2.appendChild(noteInp);
    addRow.appendChild(row2);

    const addBtn = document.createElement('button');
    addBtn.className = 'addbtn';
    addBtn.style.cssText = 'width:100%;margin-top:2px';
    addBtn.textContent = '+ اضافه کن';
    addBtn.onclick = () => addPI(b.id);
    addRow.appendChild(addBtn);

    div.appendChild(addRow);
    wrap.appendChild(div);
  });
}

function togPI(bid, iid) {
  const bl = getPlanB();
  const b = bl.find(x => x.id === bid);
  if (!b) return;
  const it = b.items.find(x => x.id === iid);
  if (it) {
    it.done = !it.done;
    if (it.done) spawnSp(document.getElementById('pi_' + iid) || document.body, '⭐');
  }
  localStorage.setItem('planBlocks', JSON.stringify(bl));
  renderPlan();
}

function delPI(bid, iid) {
  const bl = getPlanB();
  const b = bl.find(x => x.id === bid);
  if (b) b.items = b.items.filter(x => x.id !== iid);
  localStorage.setItem('planBlocks', JSON.stringify(bl));
  renderPlan();
}

function addPI(bid) {
  const t = document.getElementById('pt_' + bid);
  const e = document.getElementById('pe_' + bid);
  const time = document.getElementById('ptime_' + bid);
  const note = document.getElementById('pnote_' + bid);
  if (!t || !t.value.trim()) return;
  const bl = getPlanB();
  const b = bl.find(x => x.id === bid);
  if (b) {
    b.items.push({
      id: 'i' + Date.now(),
      text: t.value.trim(),
      emoji: e ? e.value.trim() : '',
      time: time ? time.value.trim() : '',
      note: note ? note.value.trim() : '',
      done: false
    });
    t.value = '';
    if (e) e.value = '';
    if (time) time.value = '';
    if (note) note.value = '';
  }
  localStorage.setItem('planBlocks', JSON.stringify(bl));
  renderPlan();
}

function delBlock(bid) {
  if (!confirm('این بخش حذف بشه؟')) return;
  const bl = getPlanB();
  localStorage.setItem('planBlocks', JSON.stringify(bl.filter(x => x.id !== bid)));
  renderPlan();
}

function editBTitle(bid) {
  const wrap = document.getElementById('planBlocks');
  if (!wrap) return;
  // find the span in the correct block
  const allSpans = wrap.querySelectorAll('.planbt span');
  let targetSpan = null;
  allSpans.forEach(sp => {
    if (sp.onclick && sp.onclick.toString().includes(bid)) targetSpan = sp;
  });
  // fallback: find by iterating blocks
  if (!targetSpan) {
    const blocks = wrap.querySelectorAll('.planb');
    blocks.forEach(bl => {
      const sp = bl.querySelector('.planbt span');
      if (sp && sp.onclick) targetSpan = sp;
    });
  }
  if (!targetSpan) return;
  const cur = targetSpan.textContent;
  const inp = document.createElement('input');
  inp.value = cur;
  inp.style.cssText = 'background:transparent;border:none;border-bottom:1px solid var(--pur);color:var(--t1);font-family:Vazirmatn,sans-serif;font-size:13px;font-weight:900;outline:none;width:100%';
  inp.onblur = function () {
    const bl2 = getPlanB();
    const b2 = bl2.find(x => x.id === bid);
    if (b2) { b2.title = inp.value.trim() || cur; localStorage.setItem('planBlocks', JSON.stringify(bl2)); renderPlan(); }
  };
  inp.onkeydown = e => { if (e.key === 'Enter') inp.blur(); };
  targetSpan.parentNode.replaceChild(inp, targetSpan);
  inp.focus();
}

function openAddBlock() {
  document.getElementById('mTitle').textContent = 'بخش جدید';
  document.getElementById('mBody').innerHTML = `
    <input class="minp" id="mbt" placeholder="عنوان بخش (مثلاً: 🌅 روتین صبح)">
    <button class="mprim" onclick="saveBlock()">اضافه کردن</button>
  `;
  openMod();
}

function saveBlock() {
  const t = document.getElementById('mbt').value.trim();
  if (!t) return;
  const bl = getPlanB();
  bl.push({ id: 'pb' + Date.now(), title: t, items: [] });
  localStorage.setItem('planBlocks', JSON.stringify(bl));
  closeMod();
  renderPlan();
}
