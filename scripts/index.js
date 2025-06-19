// scripts/index.js
import { SelectionManager } from './selection.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const manager = new SelectionManager({
      gridSelector: '#origin-grid',
      selectedViewSelector: '#selected-view',
      selectedCardSelector: '#selected-card',
      titleSelector: '#origin-title', // ID заголовка для страницы Origins
      descriptionSelector: '#origin-description', // ID описания для страницы Origins
      scrollContainerSelector: '#scroll-container',
      resetButtonSelector: '#reset-button',
      apiEndpoint: 'origins.json', // Загружаем данные из origins.json
      imageFolder: 'origins', // Папка с изображениями для Origins
      pageUrl: 'index.html', // URL для страницы Origins (если это главная страница, то 'index.html')
      cardClass: 'origin-card' // Класс карточек для Origins
    });
    manager.init();
  } catch (error) {
    console.error('Initialization error for Origin Selection:', error);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `<p class="error-message">Не удалось загрузить данные происхождения. ${error.message}</p>`;
    }
  }
});