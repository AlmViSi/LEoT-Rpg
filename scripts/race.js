// scripts/race.js
import { SelectionManager } from './selection.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const manager = new SelectionManager({
      gridSelector: '#race-grid',
      selectedViewSelector: '#selected-view',
      selectedCardSelector: '#selected-card',
      titleSelector: '#race-title', // ID заголовка для страницы Race
      descriptionSelector: '#race-description', // ID описания для страницы Race
      scrollContainerSelector: '#scroll-container',
      resetButtonSelector: '#reset-button',
      apiEndpoint: 'races.json', // Загружаем данные из races.json
      imageFolder: 'races', // Папка с изображениями для Races
      pageUrl: 'race.html', // URL для страницы Race
      cardClass: 'race-card' // Класс карточек для Races
    });
    manager.init();
  } catch (error) {
    console.error('Initialization error for Race Selection:', error);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `<p class="error-message">Не удалось загрузить данные рас. ${error.message}</p>`;
    }
  }
});