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
            if (!response.ok) throw new Error('Failed to load races.json');
            return response.json();
        })
        .then(data => {
            racesData = data;
            renderRaceGrid();
            renderScrollCards();
            
            // Если в URL есть ID, показываем соответствующую расу
            if (raceId) {
                const race = data.find(r => r.id === raceId);
                if (race) showRace(race);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Функция показа выбранной расы
    function showRace(race) {
        // Скрываем сетку и показываем детали
        raceGrid.style.display = 'none';
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';

        // Заполняем данные
        selectedCard.innerHTML = `<img src="images/races/${race.src}" alt="${race.name}">`;
        raceTitle.textContent = race.name;
        raceDescription.textContent = race.description;

        // Обновляем выбранную карточку в скролле
        document.querySelectorAll('.scroll-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === race.id);
        });

        // Обновляем URL
        window.history.pushState({ raceId: race.id }, '', `race.html?id=${race.id}`);
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
            card.addEventListener('click', () => showRace(race));
            raceGrid.appendChild(card);
        });
    }

    // Рендеринг карточек в полосе прокрутки
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
            scrollCard.addEventListener('click', () => showRace(race));
            scrollContainer.appendChild(scrollCard);
        });
    }

    // Обработчик кнопки возврата
    resetButton.addEventListener('click', () => {
        raceGrid.style.display = 'grid';
        selectedView.style.display = 'none';
        resetButton.style.display = 'none';
        window.history.pushState({}, '', 'race.html');
    });

    // Обработчик навигации по истории
    window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const newRaceId = urlParams.get('id');
        
        if (!newRaceId) {
            raceGrid.style.display = 'grid';
            selectedView.style.display = 'none';
            resetButton.style.display = 'none';
        } else {
            const race = racesData.find(r => r.id === newRaceId);
            if (race) showRace(race);
        }
    });

    // Инициализация при загрузке
    if (raceId) {
        raceGrid.style.display = 'none';
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';
    }
});