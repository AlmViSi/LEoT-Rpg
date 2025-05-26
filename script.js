document.addEventListener('DOMContentLoaded', () => {
    const originGrid = document.getElementById('origin-grid');
    const errorMessage = document.getElementById('error-message');
    const selectedView = document.getElementById('selected-view');
    const selectedCard = document.getElementById('selected-card');
    const originTitle = document.getElementById('origin-title');
    const originDescription = document.getElementById('origin-description');
    const scrollContainer = document.getElementById('scroll-container');
    const resetButton = document.getElementById('reset-button');
    let originsData = [];

    // Загрузка origins.json
    fetch('origins.json')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки origins.json');
            return response.json();
        })
        .then(data => {
            originsData = data;
            renderOrigins();
        })
        .catch(() => {
            errorMessage.style.display = 'block';
        });

    // Рендеринг карточек Origins
    function renderOrigins() {
        originGrid.innerHTML = '';
        
        // Создаем контейнер для горизонтального расположения
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('origin-row');
        
        originsData.forEach(origin => {
            const card = document.createElement('div');
            card.classList.add('origin-card');
            card.innerHTML = `
                <img src="Origins/${origin.src}" alt="${origin.name}">
                <div class="overlay">${origin.name}</div>
            `;
            card.addEventListener('click', () => selectOrigin(origin));
            rowContainer.appendChild(card);
        });
        
        originGrid.appendChild(rowContainer);
    }

    // Выбор Origin
    function selectOrigin(origin) {
        originGrid.style.display = 'none';
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';

        selectedCard.innerHTML = `<img src="Origins/${origin.src}" alt="${origin.name}">`;
        originTitle.textContent = origin.name;
        originDescription.textContent = origin.description;

        renderScrollCards(origin.id);
    }

    // Рендеринг мини-карточек в прокрутке
    function renderScrollCards(selectedId) {
        scrollContainer.innerHTML = '';
        originsData.forEach(origin => {
            const scrollCard = document.createElement('div');
            scrollCard.classList.add('scroll-card');
            if (origin.id === selectedId) scrollCard.classList.add('selected');
            scrollCard.innerHTML = `
                <img src="Origins/${origin.src}" alt="${origin.name}">
                <div class="overlay">${origin.name}</div>
            `;
            scrollCard.addEventListener('click', () => selectOrigin(origin));
            scrollContainer.appendChild(scrollCard);
        });
    }

    // Сброс к сетке
    resetButton.addEventListener('click', () => {
        originGrid.style.display = 'flex';
        selectedView.style.display = 'none';
        resetButton.style.display = 'none';
    });

    // Анимация частиц на canvas
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.6 + 0.4;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 163, 224, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
});