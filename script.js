document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        scrollObserver.observe(el);
    });

    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('py-2');
                navbar.classList.remove('py-4');
            } else {
                navbar.classList.add('py-4');
                navbar.classList.remove('py-2');
            }
        });
    }

    const words = ["Robotics Systems", "AI Models", "Embedded Logic"];
    const typeTarget = document.getElementById('typewriter');
    
    if (typeTarget) {
        let wordIdx = 0;
        let charIdx = 0;
        let isDeletingText = false;

        function runTypewriter() {
            const currentWord = words[wordIdx];
            
            if (isDeletingText) {
                typeTarget.textContent = currentWord.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typeTarget.textContent = currentWord.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeletingText ? 40 : 100;

            if (!isDeletingText && charIdx === currentWord.length) {
                typeSpeed = 2000; 
                isDeletingText = true;
            } else if (isDeletingText && charIdx === 0) {
                isDeletingText = false;
                wordIdx = (wordIdx + 1) % words.length;
                typeSpeed = 500; 
            }

            setTimeout(runTypewriter, typeSpeed);
        }
        
        setTimeout(runTypewriter, 800);
    }
});