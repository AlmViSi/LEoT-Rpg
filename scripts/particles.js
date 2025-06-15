function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let trails = []; // Массив для хранения следов
    const settings = {
        starCount: 5000,
        maxSpeed: 0.3,
        starSizeRange: [0.1, 2.5],
        fov: 800,
        trailLength: 5, // Количество точек в следе
        trailDecay: 0.85 // Скорость исчезновения следа
    };

    // Реальные цвета звёзд
    const starColors = [
        { temp: 30000, color: { r: 140, g: 180, b: 255 } },
        { temp: 10000, color: { r: 170, g: 200, b: 255 } },
        { temp: 7500,  color: { r: 210, g: 230, b: 255 } },
        { temp: 6000,  color: { r: 255, g: 240, b: 220 } },
        { temp: 4500,  color: { r: 255, g: 210, b: 160 } },
        { temp: 3000,  color: { r: 255, g: 160, b: 100 } }
    ];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

    // Класс для следа звезды
    class StarTrail {
        constructor(x, y, size, color) {
            this.points = [];
            this.color = color;
            this.size = size;
            
            // Инициализируем след несколькими одинаковыми точками
            for (let i = 0; i < settings.trailLength; i++) {
                this.points.push({ x, y, alpha: 0.3 });
            }
        }

        update(x, y) {
            // Добавляем новую точку
            this.points.unshift({ x, y, alpha: 0.3 });
            
            // Удаляем старые точки и уменьшаем прозрачность
            this.points = this.points.slice(0, settings.trailLength);
            this.points.forEach((point, i) => {
                point.alpha *= settings.trailDecay;
            });
        }

        draw(ctx) {
            if (this.points.length < 2) return;
            
            ctx.lineWidth = this.size * 0.7;
            
            // Рисуем след как соединённые линии
            for (let i = 0; i < this.points.length - 1; i++) {
                const p1 = this.points[i];
                const p2 = this.points[i+1];
                
                const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${p1.alpha})`);
                gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${p2.alpha})`);
                
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }

    class Star {
        constructor() {
            this.reset(true);
            this.temperature = 3000 + Math.random() * 27000;
            this.color = getStarColor(this.temperature);
            this.baseBrightness = 0.7 + Math.random() * 0.3;
            this.twinkleSpeed = 0.01 + Math.random() * 0.03;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.trail = null;
        }

        reset(initial = false) {
            this.x = (Math.random() - 0.5) * canvas.width * 3;
            this.y = (Math.random() - 0.5) * canvas.height * 3;
            this.z = initial ? Math.random() * settings.fov : settings.fov;
            this.size = settings.starSizeRange[0] + 
                       Math.pow(Math.random(), 3) * 
                       (settings.starSizeRange[1] - settings.starSizeRange[0]);
            this.speedZ = 0.1 + Math.random() * settings.maxSpeed;
            
            // Создаём новый след при появлении звезды
            if (this.trail) this.trail = null;
        }

        update() {
            const prevX = this.screenX;
            const prevY = this.screenY;
            
            this.z -= this.speedZ;
            this.twinklePhase += this.twinkleSpeed;
            
            if (this.z <= 0) {
                this.reset();
            }

            this.screenX = (this.x / this.z) * settings.fov + canvas.width / 2;
            this.screenY = (this.y / this.z) * settings.fov + canvas.height / 2;
            this.scale = settings.fov / this.z;
            this.currentSize = this.size * this.scale;
            this.brightness = this.baseBrightness * (0.8 + Math.sin(this.twinklePhase) * 0.2);

            // Обновляем или создаём след
            if (this.currentSize > 0.3 && this.z < settings.fov * 0.8) {
                if (!this.trail) {
                    this.trail = new StarTrail(this.screenX, this.screenY, this.currentSize, this.color);
                } else {
                    this.trail.update(this.screenX, this.screenY);
                }
            } else if (this.trail) {
                this.trail = null;
            }
        }

        draw(ctx) {
            if (this.screenX < -100 || this.screenX > canvas.width + 100 ||
                this.screenY < -100 || this.screenY > canvas.height + 100) return;

            // Сначала рисуем след
            if (this.trail) {
                this.trail.draw(ctx);
            }

            // Затем саму звезду
            const alpha = Math.min(1, this.brightness * this.scale * 0.5);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
            
            ctx.beginPath();
            ctx.arc(this.screenX, this.screenY, this.currentSize, 0, Math.PI * 2);
            ctx.fill();

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
        // Статичный фон
        ctx.fillStyle = '#0A0A20';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Обновление и отрисовка
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