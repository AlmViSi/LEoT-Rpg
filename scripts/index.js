document.addEventListener('DOMContentLoaded', async () => {
    const originGrid = document.getElementById('origin-grid');
    const errorMessage = document.getElementById('error-message');
    
    try {
        // Загрузка данных
        const response = await fetch('origins.json');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }
        const originsData = await response.json();

        // Проверка данных
        if (!originsData || !Array.isArray(originsData) || originsData.length === 0) {
            throw new Error('Данные origins.json пусты или имеют неверный формат');
        }

        // Рендеринг карточек
        renderOrigins(originsData);
    } catch (error) {
        console.error('Ошибка:', error);
        errorMessage.textContent = `Ошибка: ${error.message}`;
        errorMessage.style.display = 'block';
    }

    function renderOrigins(data) {
        originGrid.innerHTML = '';
        
        data.forEach(origin => {
            const card = document.createElement('div');
            card.className = 'origin-card';
            card.dataset.id = origin.id;
            
            // Добавляем обработчик ошибок для изображений
            const imgPath = `images/origins/${origin.src}`;
            card.innerHTML = `
                <img src="${imgPath}" alt="${origin.name}" 
                     onerror="this.onerror=null;this.src='images/origins/default.jpg'">
                <div class="overlay">${origin.name}</div>
            `;
            
            // Обработчик клика для перехода на страницу origin
            card.addEventListener('click', () => {
                window.location.href = `origin.html?id=${origin.id}`;
            });
            
            originGrid.appendChild(card);
        });
    }
});