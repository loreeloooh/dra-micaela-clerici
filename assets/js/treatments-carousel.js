document.addEventListener('DOMContentLoaded', function() {
    const carouselWrapper = document.querySelector('[data-carousel]');
    const track = document.querySelector('[data-carousel-track]');
    if (!carouselWrapper || !track) return;

    const controls = {
        prev: carouselWrapper.querySelector('.carousel-control.prev'),
        next: carouselWrapper.querySelector('.carousel-control.next')
    };
    const indicators = carouselWrapper.querySelector('.treatment-carousel-indicators');
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoScrollTimer = null;

    const moveToSlide = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        const x = slides[currentIndex].offsetLeft - track.offsetLeft;
        track.scrollTo({ left: x, behavior: 'smooth' });
        updateIndicators();
    };

    const updateIndicators = () => {
        if (!indicators) return;
        indicators.innerHTML = '';
        slides.forEach((_, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            if (idx === currentIndex) btn.classList.add('is-active');
            btn.addEventListener('click', () => {
                moveToSlide(idx);
                resetAutoScroll();
            });
            indicators.appendChild(btn);
        });
    };

    const resetAutoScroll = () => {
        if (autoScrollTimer) clearInterval(autoScrollTimer);
        autoScrollTimer = setInterval(() => moveToSlide(currentIndex + 1), 4500);
    };

    controls.prev?.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
        resetAutoScroll();
    });
    controls.next?.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
        resetAutoScroll();
    });

    track.addEventListener('mouseenter', () => clearInterval(autoScrollTimer));
    track.addEventListener('mouseleave', resetAutoScroll);

    moveToSlide(0);
    resetAutoScroll();
});
