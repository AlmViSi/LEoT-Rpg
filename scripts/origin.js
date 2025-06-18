document.addEventListener('DOMContentLoaded', () => {
    const selectedView = document.getElementById('selected-view');
    const selectedCard = document.getElementById('selected-card');
    const originTitle = document.getElementById('origin-title');
    const originDescription = document.getElementById('origin-description');
    const scrollContainer = document.getElementById('scroll-container');
    const resetButton = document.getElementById('reset-button');
    let originsData = [];

    // Проверка элементов
    if (!selectedView || !selectedCard || !originTitle || !originDescription || !scrollContainer || !resetButton) {
        console.error('Missing DOM elements');
        return;
    }

    // Загрузка данных
    fetch('origins.json')
        .then(response => response.json())
        .then(data => {
            originsData = data;
            renderScrollCards();
            const originId = new URLSearchParams(window.location.search).get('id');
            if (originId) {
                const origin = data.find(o => o.id === originId);
                if (origin) showOrigin(origin);
            }
        })
        .catch(error => console.error('Error:', error));

    // Показать Origin
    function showOrigin(origin) {
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';

        selectedCard.innerHTML = `<img src="images/origins/${origin.src}" alt="${origin.name}">`;
        originTitle.textContent = origin.name;
        originDescription.textContent = origin.description;

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

        window.history.pushState({}, '', `origin.html?id=${origin.id}`);
    }

    // Рендер карточек
    function renderScrollCards() {
        scrollContainer.innerHTML = '';
        originsData.forEach(origin => {
            const card = document.createElement('div');
            card.classList.add('scroll-card');
            card.dataset.id = origin.id;
            card.innerHTML = `
                <img src="images/origins/${origin.src}" alt="${origin.name}">
                <div class="overlay">${origin.name}</div>
            `;
            card.addEventListener('click', () => showOrigin(origin));
            scrollContainer.appendChild(card);
        });
    }

    // Кнопка сброса
    resetButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Обработчик истории
    window.addEventListener('popstate', () => {
        const originId = new URLSearchParams(window.location.search).get('id');
        if (!originId) {
            window.location.href = 'index.html';
        }
    });
});