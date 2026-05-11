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

    const viewport = track.parentElement;
    let currentIndex = 0;

    function getSlides()    { return Array.from(track.children); }
    function getGap()       { return parseInt(getComputedStyle(track).gap) || 30; }

    const isBlog = trackId === 'lb-track';

    function getVisibleCount() {
        const vw = window.innerWidth;
        if (vw > 1400) {
            const slides     = getSlides();
            if (!slides.length) return 1;
            const slideWidth = slides[0].offsetWidth;
            const vpWidth    = viewport.offsetWidth;
            return Math.max(1, Math.floor((vpWidth + getGap()) / (slideWidth + getGap())));
        }
        if (isBlog) return 1;
        if (vw > 1045) return 3;
        if (vw > 695)  return 2;
        return 1;
    }

    function setViewportWidth() {
        const vw = window.innerWidth;
        if (vw > 1400) {
            viewport.style.width = '';
            return;
        }
        const slides = getSlides();
        if (!slides.length) return;
        const count      = getVisibleCount();
        const gap        = getGap();
        const slideWidth = slides[0].offsetWidth;
        const w          = count * slideWidth + (count - 1) * gap;
        viewport.style.width = w + 'px';
    }

    function getMaxIndex() {
        return Math.max(0, getSlides().length - getVisibleCount());
    }

    function slideTo(index) {
        const slides = getSlides();
        if (!slides.length) return;

        const max = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, max));

        slides.forEach(s => { s.style.display = ''; });
        const slideWidth = slides[0].offsetWidth;
        const gap        = getGap();
        const offset     = currentIndex * (slideWidth + gap);
        track.style.transform = 'translateX(-' + offset + 'px)';

        prevBtn.style.opacity = currentIndex === 0  ? '0.35' : '1';
        nextBtn.style.opacity = currentIndex >= max ? '0.35' : '1';
    }

    function refresh() {
        setViewportWidth();
        const max = getMaxIndex();
        if (currentIndex > max) currentIndex = max;
        slideTo(currentIndex);
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
            diff > 0 ? slideTo(currentIndex + 1) : slideTo(currentIndex - 1);
        }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refresh, 80);
    });

    refresh();
}

initSlider('ms-track', 'ms-prev', 'ms-next');
initSlider('lc-track', 'lc-prev', 'lc-next');
initSlider('lb-track', 'lb-prev', 'lb-next');