document.addEventListener('DOMContentLoaded', () => {
    const raceGrid = document.getElementById('race-grid');
    const selectedView = document.getElementById('selected-view');
    const selectedCard = document.getElementById('selected-card');
    const raceTitle = document.getElementById('race-title');
    const raceDescription = document.getElementById('race-description');
    const scrollContainer = document.getElementById('scroll-container');
    const resetButton = document.getElementById('reset-button');
    let racesData = [];

    // Проверка элементов DOM
    if (!raceGrid || !selectedView || !selectedCard || !raceTitle || 
        !raceDescription || !scrollContainer || !resetButton) {
        console.error('One or more required elements are missing in the DOM');
        return;
    }

    // Получаем ID из URL
    const urlParams = new URLSearchParams(window.location.search);
    const raceId = urlParams.get('id');

    // Загрузка данных
    fetch('races.json')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки races.json');
            return response.json();
        })
        .then(data => {
            racesData = data;
            if (raceId) {
                const race = data.find(r => r.id === raceId);
                if (race) {
                    showRace(race);
                }
            }
            renderRaceGrid();
            renderScrollCards();
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Показать выбранную расу
    function showRace(race) {
        raceGrid.style.display = 'none';
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';

        selectedCard.innerHTML = `<img src="images/races/${race.src}" alt="${race.name}">`;
        raceTitle.textContent = race.name;
        raceDescription.textContent = race.description;

        // Обновляем выбранную карточку в скролле
        document.querySelectorAll('.scroll-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === race.id);
        });
    }

    // Рендеринг сетки рас
    function renderRaceGrid() {
        raceGrid.innerHTML = '';
        racesData.forEach(race => {
            const card = document.createElement('div');
            card.classList.add('origin-card');
            card.dataset.id = race.id;
            card.innerHTML = `
                <img src="images/races/${race.src}" alt="${race.name}">
                <div class="overlay">${race.name}</div>
            `;
            card.addEventListener('click', () => {
                showRace(race);
                window.history.pushState({}, '', `race.html?id=${race.id}`);
            });
            raceGrid.appendChild(card);
        });
    }

    // Рендеринг мини-карточек в прокрутке
    function renderScrollCards() {
        scrollContainer.innerHTML = '';
        racesData.forEach(race => {
            const scrollCard = document.createElement('div');
            scrollCard.classList.add('scroll-card');
            scrollCard.dataset.id = race.id;
            scrollCard.innerHTML = `
                <img src="images/races/${race.src}" alt="${race.name}">
                <div class="overlay">${race.name}</div>
            `;
            scrollCard.addEventListener('click', () => {
                const race = racesData.find(r => r.id === scrollCard.dataset.id);
                if (race) {
                    showRace(race);
                    window.history.pushState({}, '', `race.html?id=${race.id}`);
                }
            });
            scrollContainer.appendChild(scrollCard);
        });

        // Добавляем стиль для полосы прокрутки
        scrollContainer.style.overflowX = 'auto';
        scrollContainer.style.scrollbarWidth = 'thin';
        scrollContainer.style.paddingBottom = '10px';
    }

    // Кнопка возврата
    resetButton.addEventListener('click', () => {
        raceGrid.style.display = 'grid';
        selectedView.style.display = 'none';
        resetButton.style.display = 'none';
        window.history.pushState({}, '', 'race.html');
    });

    // Показываем выбранную расу при загрузке
    if (raceId) {
        raceGrid.style.display = 'none';
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';
    }
});