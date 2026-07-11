document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

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

    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', initCanvas);
        initCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4; 
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(14, 165, 233, 0.6)';
                ctx.fill();
            }
        }

        const particleCount = window.innerWidth < 768 ? 40 : 85;
        for (let j = 0; j < particleCount; j++) {
            particles.push(new Particle());
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            
            for (let j = 0; j < particles.length; j++) {
                if (!particles[j]) continue;
                particles[j].update();
                particles[j].draw();
                
                for (let k = j + 1; k < particles.length; k++) {
                    if (!particles[k]) continue;
                    const dx = particles[j].x - particles[k].x;
                    const dy = particles[j].y - particles[k].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(14, 165, 233, ${0.25 - dist/800})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[j].x, particles[j].y);
                        ctx.lineTo(particles[k].x, particles[k].y);
                        ctx.stroke();
                    }
                }

                if (mouse.x != null) {
                    const dx = particles[j].x - mouse.x;
                    const dy = particles[j].y - mouse.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 160) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - dist/700})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[j].x, particles[j].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }
});