document.addEventListener('DOMContentLoaded', async () => {
    const originGrid = document.getElementById('origin-grid');
    const errorMessage = document.getElementById('error-message');
    
    console.log('Начало загрузки данных...'); // Отладочное сообщение

    try {
        // 1. Загрузка данных
        const response = await fetch('origins.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const originsData = await response.json();
        
        console.log('Данные загружены:', originsData); // Отладочное сообщение

        // 2. Проверка данных
        if (!originsData || !Array.isArray(originsData) || originsData.length === 0) {
            throw new Error('Данные origins.json пусты или имеют неверный формат');
        }

        // 3. Рендеринг
        renderOrigins(originsData);
    } catch (error) {
        console.error('Ошибка:', error);
        errorMessage.textContent = `Ошибка: ${error.message}`;
        errorMessage.style.display = 'block';
    }

    function renderOrigins(data) {
        console.log('Рендеринг элементов:', data); // Отладочное сообщение
        originGrid.innerHTML = '';

        const rows = [];
        for (let i = 0; i < data.length; i += 7) {
            rows.push(data.slice(i, i + 7));
        }

        rows.forEach(rowData => {
            const row = document.createElement('div');
            row.className = 'origin-row';

            rowData.forEach(origin => {
                const card = document.createElement('div');
                card.className = 'origin-card';
                
                // Проверка пути к изображению
                const imgPath = `images/origins/${origin.src}`;
                console.log(`Попытка загрузки изображения: ${imgPath}`);
                
                card.innerHTML = `
                    <img src="${imgPath}" alt="${origin.name}" 
                         onerror="this.onerror=null;this.src='images/origins/default.jpg'">
                    <div class="overlay">${origin.name}</div>
                `;
                
                card.addEventListener('click', () => {
                    window.location.href = `origin.html?id=${origin.id}`;
                });
                
                row.appendChild(card);
            });

            originGrid.appendChild(row);
        });
    }
});