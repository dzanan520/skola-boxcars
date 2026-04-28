const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
    });
});

function initSlider(trackId, prevId, nextId) {
    const track   = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function getSlides()  { return Array.from(track.children); }
    function getGap()     { return parseInt(getComputedStyle(track).gap) || 30; }

    function getVisibleCount() {
        const viewport    = track.parentElement;
        const vw          = viewport.offsetWidth;
        const slides      = getSlides();
        if (!slides.length) return 1;
        const slideWidth  = slides[0].offsetWidth;
        return Math.max(1, Math.floor((vw + getGap()) / (slideWidth + getGap())));
    }

    function getMaxIndex() {
        return Math.max(0, getSlides().length - getVisibleCount());
    }

    function slideTo(index) {
        const slides = getSlides();
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth + getGap();
        const max = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, max));
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        prevBtn.style.opacity = currentIndex === 0   ? '0.35' : '1';
        nextBtn.style.opacity = currentIndex >= max  ? '0.35' : '1';
    }

    prevBtn.addEventListener('click', () => slideTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => slideTo(currentIndex + 1));

    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            diff > 0
                ? slideTo(currentIndex + 1)
                : slideTo(currentIndex - 1);
        }
    });

    slideTo(0);
    window.addEventListener('resize', () => slideTo(currentIndex));
}

initSlider('ms-track', 'ms-prev', 'ms-next');
initSlider('lc-track', 'lc-prev', 'lc-next');
initSlider('lb-track', 'lb-prev', 'lb-next');