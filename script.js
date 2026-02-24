document.addEventListener("DOMContentLoaded", () => {
    // 1. Set current year in footer
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Intersection Observer for fade-up animations
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-up");
    fadeElements.forEach(el => observer.observe(el));

    // 3. FAQ Accordion Logic
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            // Close all other accordions
            accordionButtons.forEach(otherBtn => {
                if (otherBtn !== button) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle the clicked one
            button.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // 4. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // 5. Gallery Auto Scroll & Drag
    const galleryTrack = document.getElementById('gallery-track');
    if (galleryTrack) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoScrollInterval;
        let scrollSpeed = 1; // pixels per interval

        // Duplicate content inside track for seamless endless scroll effect
        galleryTrack.innerHTML += galleryTrack.innerHTML;

        const startAutoScroll = () => {
            if (autoScrollInterval) clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                if (galleryTrack.scrollLeft >= (galleryTrack.scrollWidth / 2)) {
                    galleryTrack.scrollLeft = 0;
                } else {
                    galleryTrack.scrollLeft += scrollSpeed;
                }
            }, 30); // ~33fps
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Start autoscroll initially
        startAutoScroll();

        // Pause on hover
        galleryTrack.addEventListener('mouseenter', stopAutoScroll);
        galleryTrack.addEventListener('mouseleave', () => {
            isDown = false;
            galleryTrack.parentElement.classList.remove('active-drag');
            startAutoScroll();
        });

        // Mouse drag logic
        galleryTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            galleryTrack.parentElement.classList.add('active-drag');
            startX = e.pageX - galleryTrack.offsetLeft;
            scrollLeft = galleryTrack.scrollLeft;
            stopAutoScroll();
            // Prevent default image drag
            e.preventDefault();
        });

        galleryTrack.addEventListener('mouseup', () => {
            isDown = false;
            galleryTrack.parentElement.classList.remove('active-drag');
            startAutoScroll();
        });

        galleryTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - galleryTrack.offsetLeft;
            const walk = (x - startX) * 2; // scroll speed multiplier
            galleryTrack.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        galleryTrack.addEventListener('touchstart', stopAutoScroll, { passive: true });
        galleryTrack.addEventListener('touchend', startAutoScroll);
    }
});
