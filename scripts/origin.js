document.addEventListener('DOMContentLoaded', () => {
    const originGrid = document.getElementById('origin-grid');
    const selectedView = document.getElementById('selected-view');
    const selectedCard = document.getElementById('selected-card');
    const originTitle = document.getElementById('origin-title');
    const originDescription = document.getElementById('origin-description');
    const scrollContainer = document.getElementById('scroll-container');
    const resetButton = document.getElementById('reset-button');
    let originsData = [];

    // Проверка элементов DOM
    if (!originGrid || !selectedView || !selectedCard || !originTitle || 
        !originDescription || !scrollContainer || !resetButton) {
        console.error('One or more required elements are missing in the DOM');
        return;
    }

    // Получаем ID из URL
    const urlParams = new URLSearchParams(window.location.search);
    const originId = urlParams.get('id');

    // Загрузка данных
    fetch('origins.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load origins.json');
            return response.json();
        })
        .then(data => {
            originsData = data;
            renderOriginGrid();
            renderScrollCards();
            
            // Если в URL есть ID, показываем соответствующий origin
            if (originId) {
                const origin = data.find(o => o.id === originId);
                if (origin) showOrigin(origin);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Функция показа выбранного origin
    function showOrigin(origin) {
        // Скрываем сетку и показываем детали
        originGrid.style.display = 'none';
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';

        // Заполняем данные
        selectedCard.innerHTML = `<img src="images/origins/${origin.src}" alt="${origin.name}">`;
        originTitle.textContent = origin.name;
        originDescription.textContent = origin.description;

        // Обновляем выбранную карточку в скролле
        document.querySelectorAll('.scroll-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === origin.id);
            if (card.dataset.id === origin.id) {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });

        // Обновляем URL
        window.history.pushState({ originId: origin.id }, '', `origin.html?id=${origin.id}`);
    }

    // Рендеринг сетки origins
    function renderOriginGrid() {
        originGrid.innerHTML = '';
        originsData.forEach(origin => {
            const card = document.createElement('div');
            card.classList.add('origin-card');
            card.dataset.id = origin.id;
            card.innerHTML = `
                <img src="images/origins/${origin.src}" alt="${origin.name}">
                <div class="overlay">${origin.name}</div>
            `;
            card.addEventListener('click', () => showOrigin(origin));
            originGrid.appendChild(card);
        });
    }

    // Рендеринг карточек в полосе прокрутки
    function renderScrollCards() {
        scrollContainer.innerHTML = '';
        originsData.forEach(origin => {
            const scrollCard = document.createElement('div');
            scrollCard.classList.add('scroll-card');
            scrollCard.dataset.id = origin.id;
            scrollCard.innerHTML = `
                <img src="images/origins/${origin.src}" alt="${origin.name}">
                <div class="overlay">${origin.name}</div>
            `;
            scrollCard.addEventListener('click', () => showOrigin(origin));
            scrollContainer.appendChild(scrollCard);
        });
    }

    // Обработчик кнопки возврата
    resetButton.addEventListener('click', () => {
        originGrid.style.display = 'grid';
        selectedView.style.display = 'none';
        resetButton.style.display = 'none';
        window.history.pushState({}, '', 'origin.html');
    });

    // Обработчик навигации по истории
    window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const newOriginId = urlParams.get('id');
        
        if (!newOriginId) {
            originGrid.style.display = 'grid';
            selectedView.style.display = 'none';
            resetButton.style.display = 'none';
        } else {
            const origin = originsData.find(o => o.id === newOriginId);
            if (origin) showOrigin(origin);
        }
    });

    // Инициализация при загрузке
    if (originId) {
        originGrid.style.display = 'none';
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';
    }
});