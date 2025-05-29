```javascript
document.addEventListener('DOMContentLoaded', () => {
    const originGrid = document.querySelector('.origin-grid');
    const raceGrid = document.querySelector('.race-grid');
    const selectedOriginView = document.getElementById('selected-origin-view');
    const selectedRaceView = document.getElementById('selected-race-view');
    const errorMessage = document.querySelector('.error-message');
    const resetButton = document.getElementById('reset-button');
    const nextButton = document.getElementById('next-to-race');
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');

    let origins = [];
    let races = [];
    let selectedOrigin = null;
    let selectedRace = null;

    // Canvas Animation
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 163, 224, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].size <= 0.2) {
                particles.splice(i, 1);
                i--;
            }
        }
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.1) particles.push(new Particle());
        handleParticles();
        requestAnimationFrame(animate);
    }
    animate();

    // Load Data
    async function loadData() {
        try {
            const [originsResponse, racesResponse] = await Promise.all([
                fetch('origins.json'),
                fetch('races.json')
            ]);
            origins = await originsResponse.json();
            races = await racesResponse.json();
            displayOrigins();
        } catch (error) {
            errorMessage.style.display = 'block';
            console.error('Error loading data:', error);
        }
    }

    // Display Origins
    function displayOrigins() {
        const row1 = document.getElementById('origin-row-1');
        const row2 = document.getElementById('origin-row-2');
        origins.forEach((origin, index) => {
            const card = document.createElement('div');
            card.classList.add('origin-card');
            card.innerHTML = `
                <img src="Origins/${origin.src}" alt="${origin.name}">
                <div class="overlay">${origin.name}</div>
            `;
            card.addEventListener('click', () => selectOrigin(origin));
            if (index < Math.ceil(origins.length / 2)) {
                row1.appendChild(card);
            } else {
                row2.appendChild(card);
            }
        });
    }

    // Select Origin
    function selectOrigin(origin) {
        selectedOrigin = origin;
        originGrid.style.display = 'none';
        selectedOriginView.style.display = 'flex';
        resetButton.style.display = 'block';
        nextButton.style.display = 'block';
        document.getElementById('selected-origin-image').src = `Origins/${origin.src}`;
        document.getElementById('selected-origin-name').textContent = origin.name;
        document.getElementById('selected-origin-description').textContent = origin.description;
        updateOriginScroll();
    }

    // Update Origin Scroll
    function updateOriginScroll() {
        const scrollContainer = document.getElementById('origin-scroll-container');
        scrollContainer.innerHTML = '';
        origins.forEach(origin => {
            const scrollCard = document.createElement('div');
            scrollCard.classList.add('scroll-card');
            if (origin.id === selectedOrigin.id) scrollCard.classList.add('selected');
            scrollCard.innerHTML = `
                <img src="Origins/${origin.src}" alt="${origin.name}">
                <div class="overlay">${origin.name}</div>
            `;
            scrollCard.addEventListener('click', () => selectOrigin(origin));
            scrollContainer.appendChild(scrollCard);
        });
    }

    // Display Races
    function displayRaces() {
        const row1 = document.getElementById('race-row-1');
        const row2 = document.getElementById('race-row-2');
        row1.innerHTML = '';
        row2.innerHTML = '';
        races.forEach((race, index) => {
            const card = document.createElement('div');
            card.classList.add('race-card');
            card.innerHTML = `
                <img src="Races/${race.src}" alt="${race.name}">
                <div class="overlay">${race.name}</div>
            `;
            card.addEventListener('click', () => selectRace(race));
            if (index < Math.ceil(races.length / 2)) {
                row1.appendChild(card);
            } else {
                row2.appendChild(card);
            }
        });
    }

    // Select Race
    function selectRace(race) {
        selectedRace = race;
        raceGrid.style.display = 'none';
        selectedRaceView.style.display = 'flex';
        resetButton.style.display = 'block';
        nextButton.style.display = 'none';
        document.getElementById('selected-race-image').src = `Races/${race.src}`;
        document.getElementById('selected-race-name').textContent = race.name;
        document.getElementById('selected-race-description').textContent = race.description;
        updateRaceScroll();
    }

    // Update Race Scroll
    function updateRaceScroll() {
        const scrollContainer = document.getElementById('race-scroll-container');
        scrollContainer.innerHTML = '';
        races.forEach(race => {
            const scrollCard = document.createElement('div');
            scrollCard.classList.add('scroll-card');
            if (selectedRace && race.id === selectedRace.id) scrollCard.classList.add('selected');
            scrollCard.innerHTML = `
                <img src="Races/${race.src}" alt="${race.name}">
                <div class="overlay">${race.name}</div>
            `;
            scrollCard.addEventListener('click', () => selectRace(race));
            scrollContainer.appendChild(scrollCard);
        });
    }

    // Next to Race Selection
    nextButton.addEventListener('click', () => {
        selectedOriginView.style.display = 'none';
        raceGrid.style.display = 'flex';
        resetButton.style.display = 'block';
        nextButton.style.display = 'none';
        displayRaces();
    });

    // Reset Button Logic
    resetButton.addEventListener('click', () => {
        if (selectedRaceView.style.display === 'flex') {
            selectedRaceView.style.display = 'none';
            raceGrid.style.display = 'flex';
            selectedRace = null;
        } else if (selectedOriginView.style.display === 'flex') {
            selectedOriginView.style.display = 'none';
            originGrid.style.display = 'flex';
            selectedOrigin = null;
            nextButton.style.display = 'none';
        } else {
            raceGrid.style.display = 'none';
            originGrid.style.display = 'flex';
        }
        resetButton.style.display = 'none';
    });

    // Initialize
    loadData();
});
```