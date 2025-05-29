```javascript
document.addEventListener('DOMContentLoaded', () => {
    const originGrid = document.getElementById('origin-grid');
    const raceGrid = document.getElementById('race-grid');
    const selectedOriginView = document.getElementById('selected-origin-view');
    const selectedRaceView = document.getElementById('selected-race-view');
    const errorMessage = document.getElementById('error-message');
    const resetButton = document.getElementById('reset-button');
    const nextButton = document.getElementById('next-to-race');
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let origins = [];
    let races = [];
    let selectedOrigin = null;
    let selectedRace = null;

    // Canvas Animation
    function initCanvas() {
        if (!canvas || !ctx) {
            console.error('Canvas or context not found');
            return;
        }
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
    }
    initCanvas();

    // Load Data
    async function loadData() {
        try {
            const [originsResponse, racesResponse] = await Promise.all([
                fetch('origins.json').then(res => {
                    if (!res.ok) throw new Error(`Failed to load origins.json: ${res.status} ${res.statusText}`);
                    return res.json();
                }),
                fetch('races.json').then(res => {
                    if (!res.ok) throw new Error(`Failed to load races.json: ${res.status} ${res.statusText}`);
                    return res.json();
                })
            ]);
            // Validate data
            if (!Array.isArray(originsResponse)) throw new Error('origins.json is not an array');
            if (!Array.isArray(racesResponse)) throw new Error('races.json is not an array');
            origins = originsResponse.filter(item => {
                if (!item || typeof item !== 'object' || !item.id || !item.name || !item.src || !item.description) {
                    console.warn('Invalid origin data:', item);
                    return false;
                }
                return true;
            });
            races = racesResponse.filter(item => {
                if (!item || typeof item !== 'object' || !item.id || !item.name || !item.src || !item.description) {
                    console.warn('Invalid race data:', item);
                    return false;
                }
                return true;
            });
            if (origins.length === 0) throw new Error('No valid data in origins.json');
            if (races.length === 0) throw new Error('No valid data in races.json');
            console.log('Loaded origins:', origins);
            console.log('Loaded races:', races);
            displayOrigins();
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = `Ошибка загрузки: ${error.message}`;
            console.error('Error loading data:', error);
        }
    }

    // Display Origins
    function displayOrigins() {
        const row1 = document.getElementById('origin-row-1');
        const row2 = document.getElementById('origin-row-2');
        if (!row1 || !row2) {
            console.error('Origin row elements not found');
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Ошибка: не найдены элементы для отображения Origins';
            return;
        }
        row1.innerHTML = '';
        row2.innerHTML = '';
        origins.forEach((origin, index) => {
            // Skip invalid entries
            if (!origin || !origin.src || !origin.name) {
                console.warn(`Skipping invalid origin at index ${index}:`, origin);
                return;
            }
            const card = document.createElement('div');
            card.classList.add('origin-card');
            card.innerHTML = `
                <img src="Origins/${origin.src}" alt="${origin.name}" onerror="this.src='Origins/placeholder.jpg'">
                <div class="overlay">${origin.name}</div>
            `;
            card.addEventListener('click', () => selectOrigin(origin));
            if (index < Math.ceil(origins.length / 2)) {
                row1.appendChild(card);
            } else {
                row2.appendChild(card);
            }
        });
        if (row1.children.length === 0 && row2.children.length === 0) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Ошибка: нет данных для отображения Origins';
        }
    }

    // Select Origin
    function selectOrigin(origin) {
        if (!origin || !origin.src || !origin.name || !origin.description) {
            console.error('Invalid origin selected:', origin);
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Ошибка: выбран неверный Origin';
            return;
        }
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
        if (!scrollContainer) {
            console.error('Origin scroll container not found');
            return;
        }
        scrollContainer.innerHTML = '';
        origins.forEach(origin => {
            if (!origin || !origin.src || !origin.name) {
                console.warn('Invalid origin in scroll:', origin);
                return;
            }
            const scrollCard = document.createElement('div');
            scrollCard.classList.add('scroll-card');
            if (origin.id === selectedOrigin.id) scrollCard.classList.add('selected');
            scrollCard.innerHTML = `
                <img src="Origins/${origin.src}" alt"${origin.name}" onerror="this.src='Origins/placeholder.jpg'">
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
        if (!row1 || !row2) {
            console.error('Race row elements not found');
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Ошибка: не найдены элементы для отображения Races';
            return;
        }
        row1.innerHTML = '';
        row2.innerHTML = '';
        races.forEach((race, index) => {
            if (!race || !race.src || !race.name) {
                console.warn(`Skipping invalid race at index ${index}:`, race);
                return;
            }
            const card = document.createElement('div');
            card.classList.add('race-card');
            card.innerHTML = `
                <img src="Races/${race.src}" alt="${race.name}" onerror="this.src='Races/placeholder.jpg'">
                <div class="overlay">${race.name}</div>
            `;
            card.addEventListener('click', () => selectRace(race));
            if (index < Math.ceil(races.length / 2)) {
                row1.appendChild(card);
            } else {
                row2.appendChild(card);
            }
        });
        if (row1.children.length === 0 && row2.children.length === 0) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Ошибка: нет данных для отображения Races';
        }
    }

    // Select Race
    function selectRace(race) {
        if (!race || !race.src || !race.name || !race.description) {
            console.error('Invalid race selected:', race);
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Ошибка: выбрана неверная раса';
            return;
        }
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
        if (!scrollContainer) {
            console.error('Race scroll container not found');
            return;
        }
        scrollContainer.innerHTML = '';
        races.forEach(race => {
            if (!race || !race.src || !race.name) {
                console.warn('Invalid race in scroll:', race);
                return;
            }
            const scrollCard = document.createElement('div');
            scrollCard.classList.add('scroll-card');
            if (selectedRace && race.id === selectedRace.id) scrollCard.classList.add('selected');
            scrollCard.innerHTML = `
                <img src="Races/${race.src}" alt="${race.name}" onerror="this.src='Races/placeholder.jpg'">
                <div class="overlay">${race.name}</div>
            `;
            scrollCard.addEventListener('click', () => selectRace(race));
            scrollContainer.appendChild(scrollCard);
        });
    }

    // Next to Race Selection
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            selectedOriginView.style.display = 'none';
            raceGrid.style.display = 'flex';
            resetButton.style.display = 'block';
            nextButton.style.display = 'none';
            displayRaces();
        });
    } else {
        console.error('Next button not found');
    }

    // Reset Button Logic
    if (resetButton) {
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
    } else {
        console.error('Reset button not found');
    }

    // Initialize
    loadData();
});
```