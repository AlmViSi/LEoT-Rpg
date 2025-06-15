function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    
    const settings = {
        starCount: 5000,
        maxSpeed: 0.3,
        starSizeRange: [0.1, 2.5],
        fov: 800
    };

    // Реальные цвета звёзд по температурной шкале (Кельвины)
    const starColors = [
        { temp: 30000, color: { r: 140, g: 180, b: 255 } }, // Голубые
        { temp: 10000, color: { r: 170, g: 200, b: 255 } }, // Бело-голубые
        { temp: 7500,  color: { r: 210, g: 230, b: 255 } }, // Белые
        { temp: 6000,  color: { r: 255, g: 240, b: 220 } }, // Жёлто-белые (Солнце)
        { temp: 4500,  color: { r: 255, g: 210, b: 160 } }, // Оранжевые
        { temp: 3000,  color: { r: 255, g: 160, b: 100 } }  // Красные
    ];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Получение цвета по температуре
    function getStarColor(temp) {
        for (let i = 0; i < starColors.length - 1; i++) {
            if (temp >= starColors[i+1].temp && temp <= starColors[i].temp) {
                const ratio = (temp - starColors[i+1].temp) / 
                              (starColors[i].temp - starColors[i+1].temp);
                return {
                    r: Math.round(starColors[i+1].color.r + 
                       ratio * (starColors[i].color.r - starColors[i+1].color.r)),
                    g: Math.round(starColors[i+1].color.g + 
                       ratio * (starColors[i].color.g - starColors[i+1].color.g)),
                    b: Math.round(starColors[i+1].color.b + 
                       ratio * (starColors[i].color.b - starColors[i+1].color.b))
                };
            }
        }
        return starColors[starColors.length-1].color;
    }

    class Star {
        constructor() {
            this.reset(true);
            this.temperature = 3000 + Math.random() * 27000; // 3000K-30000K
            this.color = getStarColor(this.temperature);
            this.baseBrightness = 0.7 + Math.random() * 0.3;
            this.twinkleSpeed = 0.01 + Math.random() * 0.03;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }

        reset(initial = false) {
            this.x = (Math.random() - 0.5) * canvas.width * 3;
            this.y = (Math.random() - 0.5) * canvas.height * 3;
            this.z = initial ? Math.random() * settings.fov : settings.fov;
            this.size = settings.starSizeRange[0] + 
                       Math.pow(Math.random(), 3) * 
                       (settings.starSizeRange[1] - settings.starSizeRange[0]);
            this.speedZ = 0.1 + Math.random() * settings.maxSpeed;
        }

        update() {
            this.z -= this.speedZ;
            this.twinklePhase += this.twinkleSpeed;
            
            if (this.z <= 0) {
                this.reset();
            }

            // 3D проекция
            this.screenX = (this.x / this.z) * settings.fov + canvas.width / 2;
            this.screenY = (this.y / this.z) * settings.fov + canvas.height / 2;
            this.scale = settings.fov / this.z;
            this.currentSize = this.size * this.scale;
            this.brightness = this.baseBrightness * 
                            (0.8 + Math.sin(this.twinklePhase) * 0.2);
        }

        draw(ctx) {
            if (this.screenX < -100 || this.screenX > canvas.width + 100 ||
                this.screenY < -100 || this.screenY > canvas.height + 100) return;

            const alpha = Math.min(1, this.brightness * this.scale * 0.5);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
            
            ctx.beginPath();
            ctx.arc(this.screenX, this.screenY, this.currentSize, 0, Math.PI * 2);
            ctx.fill();

            // Свечение для ярких звёзд
            if (this.currentSize > 1.5) {
                const glowRadius = this.currentSize * 3;
                const gradient = ctx.createRadialGradient(
                    this.screenX, this.screenY, 0,
                    this.screenX, this.screenY, glowRadius
                );
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.3)`);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.screenX, this.screenY, glowRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function initStars() {
        for (let i = 0; i < settings.starCount; i++) {
            stars.push(new Star());
        }
    }

    function animate() {
        // Статичный тёмно-космический фон
        ctx.fillStyle = '#0A0A20';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Обновление и отрисовка звёзд
        stars.forEach(star => {
            star.update();
            star.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    initStars();
    animate();
}

document.addEventListener('DOMContentLoaded', initParticles);