document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    const navBar = document.getElementById('mainNav');
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const dropMenu = document.getElementById('mobile-menu');

    if (toggleBtn && dropMenu) {
        toggleBtn.addEventListener('click', () => {
            dropMenu.classList.toggle('hidden');
        });

        dropMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => dropMenu.classList.add('hidden'));
        });
    }

    window.addEventListener('scroll', () => {
        if (navBar) {
            if (window.scrollY > 50) {
                navBar.classList.add('py-2');
             navBar.classList.remove('py-4');
            } else {
                navBar.classList.add('py-4');
                navBar.classList.remove('py-2');
            }
        }    
    });

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        scrollObserver.observe(el);
    });

    const wordsToType = ["Robotics Systems", "AI Models", "Embedded Logic & Systems"];
    const typeTarget = document.getElementById('typewriter');

    if (typeTarget) {
        let wordIdx = 0;
        let chardIdx = 0;
        let isDeletingText = false;

        function runTypewriter () {
            const currentWord = wordsToType[wordIdx];

            if(isDeletingText) {
                typeTarget.textContent = currentWord.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typeTarget.textContent = currentWord.substring(0, chardIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeletingText ? 40 : 100;

            if (!isDeletingText && charIdx == currentWord.length) {
                typeSpeed = 2000;
                isDeletingText = true;
            } else if (isDeletingText && chardIdx === 0) {
                isDeletingText = false;
                wordIdx = (wordIdx + 1) % wordsToType.length;
                typeSpeed = 500;
            }

            setTimeout(runTypewriter, typeSpeed);
        }

        setTimeout(runTypewriter, 800);
    }

    const ctxCanvas = document.getElementById('bg-canvas');
    if (ctxCanvas) {
        const ctx = ctxCanvas.getContext('2d');
        let cWidth, cHeight;
        let dots = [];
        let mousePos = {x: null, y: null};

        function resizeCanvas() {
            cWidth = ctxCanvas.width = window.innerWidth;
            cHeight = ctxCanvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', e => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mousePos.x = null;
            mousePos.y = null;
        });

        class Dot {
            constructor() {
                this.x = Math.random() * cWidth;
                this.y = Math.random() * cHeight;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 1.5 + 0.5;
            }

            move() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > cWidth) this.speedX *= -1;
                if (this.y < 0 || this.y > cHeight) this.speedY *= -1;
            }

            render() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
                ctx.fill();
            }
        }

        const maxDots = window.innerWidth < 768 ? 40:80;
        for (let i = 0; i < maxDots; i++) {
            dots.push(new Dot());
        }

        function drawConnections() {
            ctx.clearRect(0, 0, cWidth, cHeight);

            for (let i = 0; i < dots.length; i++) {
                dots[i].move();
                dots[i].render();

                for (let j = i; i < dots.length; j++) {
                    if (!dots[j]) continue;
                    const diffX = dots[i].x - dots[j].x;
                    const diffY = dots[i].y - dots[j].y;
                    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(14, 165, 233, ${0.2 - distance/600})';
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }

                if (mousePos.x !== null) {
                    const diffMouseX = dots[i].x - mousePos.x;
                    const diffMouseY = dots[i].y - mousePos.y;
                    const mouseDist = Math.sqrt(diffMouseX * diffMouseX + diffMouseY * diffMouseY);

                    if (mouseDist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(255, 255, 255, ${0.25 - mouseDist/600})';
                        ctx.lineWidth = 1;
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(mousePos.x, mousePos.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawConnections);
        }

        drawConnections();
    }
});