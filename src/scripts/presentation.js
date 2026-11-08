/* Presentation runtime — keyboard nav, 16:9 scaling, progress. No network needed. */
(function () {
  const stage = document.getElementById('stage');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const counter = document.getElementById('counter');
  const progress = document.getElementById('progress');
  const hint = document.getElementById('hint');
  let index = 0;

  function fit() {
    const s = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    stage.style.transform = `scale(${s})`;
  }

  function show(n) {
    index = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((el, i) => el.classList.toggle('active', i === index));
    counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    progress.style.width = ((index + 1) / slides.length * 100) + '%';
    document.title = `(${index + 1}/${slides.length}) ` + slides[index].dataset.title + ' — Kahoot Usability';
    history.replaceState(null, '', '#' + (index + 1));
  }

  const next = () => show(index + 1);
  const prev = () => show(index - 1);

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      // RTL deck: ArrowLeft moves forward, ArrowRight moves back
      case 'ArrowLeft': case 'PageDown': next(); e.preventDefault(); break;
      case 'ArrowRight': case 'PageUp': prev(); e.preventDefault(); break;
      case ' ': e.shiftKey ? prev() : next(); e.preventDefault(); break;
      case 'Home': show(0); e.preventDefault(); break;
      case 'End': show(slides.length - 1); e.preventDefault(); break;
    }
  });

  // Click / tap zones: left half = next, right half = previous (RTL)
  stage.addEventListener('click', (e) => {
    const r = stage.getBoundingClientRect();
    (e.clientX - r.left) / r.width < 0.5 ? next() : prev();
  });

  let touchX = null;
  stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    touchX = null;
  }, { passive: true });

  window.addEventListener('resize', fit);
  fit();
  const initial = parseInt((location.hash || '').slice(1), 10);
  show(Number.isFinite(initial) && initial >= 1 ? initial - 1 : 0);
  setTimeout(() => { hint.style.opacity = '0'; }, 6000);
})();
