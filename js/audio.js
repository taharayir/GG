/* ═══════════════════════════════════════
   موزیک پلیر
═══════════════════════════════════════ */

let audioEl = null;
let audioPlaying = false;
let audioSelI = null;

function loadAudio(src) {
  if (audioEl) { audioEl.pause(); audioEl = null; }
  audioEl = new Audio(src);
  audioEl.volume = .8;
  audioEl.ontimeupdate = function() {
    if (!audioEl || !audioEl.duration) return;
    const bar = document.getElementById('mpbar');
    if (bar) bar.style.width = (audioEl.currentTime / audioEl.duration * 100) + '%';
    // time display
    const td = document.getElementById('mptime');
    if (td) {
      const cur = Math.floor(audioEl.currentTime);
      const tot = Math.floor(audioEl.duration);
      td.textContent = fmt(cur) + ' / ' + fmt(tot);
    }
  };
  audioEl.onended = function() {
    audioPlaying = false;
    const b = document.getElementById('mpbtn');
    if (b) b.textContent = '▶';
  };
  audioEl.onerror = function() {
    console.warn('Audio load error');
  };
}

function fmt(s) {
  return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
}

function pickMus(i) {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'audio/*';
  inp.onchange = function(e) {
    const f = e.target.files[0];
    if (!f) return;
    // store name only (not the file data for memory reasons)
    localStorage.setItem('mn_'+i, f.name);
    const r = new FileReader();
    r.onload = function(ev) {
      // store audio data
      try {
        localStorage.setItem('mf_'+i, ev.target.result);
      } catch(err) {
        // localStorage might be full — warn user
        alert('حافظه مرورگر پر شده. لطفاً داده‌های قدیمی رو پاک کن.');
        return;
      }
      const nm = document.getElementById('mpname');
      if (nm) nm.textContent = f.name;
      audioSelI = i;
      loadAudio(ev.target.result);
    };
    r.readAsDataURL(f);
  };
  inp.click();
}

function togPlay() {
  if (typeof selI === 'undefined' || selI === null) return;
  const mf = localStorage.getItem('mf_' + selI);
  if (!audioEl && mf) {
    audioSelI = selI;
    loadAudio(mf);
  }
  if (!audioEl) return;
  if (audioPlaying) {
    audioEl.pause();
    audioPlaying = false;
    const b = document.getElementById('mpbtn');
    if (b) b.textContent = '▶';
  } else {
    audioEl.play().catch(err => console.warn('Play blocked:', err));
    audioPlaying = true;
    const b = document.getElementById('mpbtn');
    if (b) b.textContent = '⏸';
  }
}

function setVol(v) {
  if (audioEl) audioEl.volume = parseFloat(v);
}

function seekTrack(e) {
  if (!audioEl || !audioEl.duration) return;
  const track = e.currentTarget;
  const rect = track.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audioEl.currentTime = pct * audioEl.duration;
}

function stopAudio() {
  if (audioEl) { audioEl.pause(); audioEl = null; audioPlaying = false; }
}
