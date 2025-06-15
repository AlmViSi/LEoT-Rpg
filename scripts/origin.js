document.addEventListener('DOMContentLoaded', () => {
    const selectedView = document.getElementById('selected-view');
    const selectedCard = document.getElementById('selected-card');
    const originTitle = document.getElementById('origin-title');
    const originDescription = document.getElementById('origin-description');
    const scrollContainer = document.getElementById('scroll-container');
    const resetButton = document.getElementById('reset-button');
    let originsData = [];

    // Получаем ID из URL
    const urlParams = new URLSearchParams(window.location.search);
    const originId = urlParams.get('id');

    // Загрузка данных
    fetch('origins.json')
        .then(response => response.json())
        .then(data => {
            originsData = data;
            if (originId) {
                const origin = data.find(o => o.id === originId);
                if (origin) {
                    showOrigin(origin);
                }
            }
            renderScrollCards();
        });

    // Показать выбранный Origin
    function showOrigin(origin) {
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';

        selectedCard.innerHTML = `<img src="images/origins/${origin.src}" alt="${origin.name}">`;
        originTitle.textContent = origin.name;
        originDescription.textContent = origin.description;

        // Обновляем выбранную карточку в скролле
        document.querySelectorAll('.scroll-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === origin.id);
        });
    }

    // Рендеринг мини-карточек в прокрутке
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
            scrollCard.addEventListener('click', () => {
                const origin = originsData.find(o => o.id === scrollCard.dataset.id);
                if (origin) {
                    showOrigin(origin);
                    // Обновляем URL без перезагрузки страницы
                    window.history.pushState({}, '', `origin.html?id=${origin.id}`);
                }
            });
            scrollContainer.appendChild(scrollCard);
        });
    }

    // Кнопка возврата
    resetButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Показываем выбранный Origin при загрузке
    if (originId) {
        selectedView.style.display = 'flex';
        resetButton.style.display = 'block';
    }
});