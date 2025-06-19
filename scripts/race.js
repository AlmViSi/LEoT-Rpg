// scripts/race.js
import { SelectionManager } from './selection.js';

document.addEventListener('DOMContentLoaded', () => {
  new SelectionManager({
    gridSelector: '#race-grid',
    selectedViewSelector: '#selected-view',
    selectedCardSelector: '#selected-card',
    titleSelector: '#race-title',
    descriptionSelector: '#race-description',
    scrollContainerSelector: '#scroll-container',
    resetButtonSelector: '#reset-button',
    apiEndpoint: 'races.json',
    imageFolder: 'races',
    pageUrl: 'race.html',
    cardClass: 'race-card'
  }).init();
});