document.addEventListener('DOMContentLoaded', () => {
    // Обработка выбора Power Set
    const powerSetItems = document.querySelectorAll('.powerset-item');
    powerSetItems.forEach(item => {
        item.addEventListener('click', () => {
            powerSetItems.forEach(i => i.style.background = 'rgba(10, 10, 10, 0.5)');
            item.style.background = 'rgba(0, 163, 224, 0.3)';
            // Здесь можно добавить логику отображения способностей
        });
    });
});