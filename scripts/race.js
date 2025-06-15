document.addEventListener('DOMContentLoaded', () => {
    const raceGrid = document.getElementById('race-grid');
    const errorMessage = document.getElementById('error-message');
    const selectedView = document.getElementById('selected-view');
    const selectedCard = document.getElementById('selected-card');
    const raceTitle = document.getElementById('race-title');
    const raceDescription = document.getElementById('race-description');
    const scrollContainer = document.getElementById('scroll-container');
    const resetButton = document.getElementById('reset-button');
    let racesData = [];

    // Загрузка races.json
    fetch('races.json')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки races.json');
            return response.json();
        })
        .then(data => {
            racesData = data;
            renderRaces();
        })
        .catch(() => {
            errorMessage.style.display = 'block';
        });

    // Рендеринг карточек рас
    function renderRaces() {
        raceGrid.innerHTML = '';
        
        const firstRowRaces = racesData.slice(0, 7);
        const secondRowRaces = racesData.slice(7, 14);

        const firstRowContainer = document.createElement('div');
        firstRowContainer.classList.add('origin-row');
        firstRowRaces.forEach(race => {
            const card = document.createElement('div');
            card.classList.add('origin-card');
            card.innerHTML = `
                <img src="Origins/${race.src}" alt="${race.name}">
                <div class="overlay">${race.name}</div>
            `;
            card.addEventListener('click', () => selectRace(race));
            firstRowContainer.appendChild(card);
        });

        const secondRowContainer = document.createElement('div');
        secondRowContainer.classList.add('origin-row');
        secondRowRaces.forEach(race => {
            const card = document.createElement('div');
            card.classList.add('origin-card');
            card.innerHTML = `
                <img src="Origins/${race.src}" alt="${race.name}">
                <div class="overlay">${race.name}</div>
            `;
            card.addEventListener('click', () => selectRace(race));
            secondRowContainer.appendChild(card);
        });

        raceGrid.appendChild(firstRowContainer);
        raceGrid.appendChild(secondRowContainer);
    }

    // Выбор расы
    function selectRace(race) {
        raceGrid.style.display = 'none';
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';

        selectedCard.innerHTML = `<img src="Origins/${race.src}" alt="${race.name}">`;
        raceTitle.textContent = race.name;
        raceDescription.textContent = race.description;

        renderScrollCards(race.id);
    }

    // Рендеринг мини-карточек в прокрутке
    function renderScrollCards(selectedId) {
        scrollContainer.innerHTML = '';
        racesData.forEach(race => {
            const scrollCard = document.createElement('div');
            scrollCard.classList.add('scroll-card');
            if (race.id === selectedId) scrollCard.classList.add('selected');
            scrollCard.innerHTML = `
                <img src="Origins/${race.src}" alt="${race.name}">
                <div class="overlay">${race.name}</div>
            `;
            scrollCard.addEventListener('click', () => selectRace(race));
            scrollContainer.appendChild(scrollCard);
        });
    }

    // Сброс к сетке
    resetButton.addEventListener('click', () => {
        raceGrid.style.display = 'flex';
        selectedView.style.display = 'none';
        resetButton.style.display = 'none';
    });
});