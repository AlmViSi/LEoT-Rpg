// scripts/origin.js
import { SelectionManager } from './selection.js';

document.addEventListener('DOMContentLoaded', () => {
  new SelectionManager({
    gridSelector: '#origin-grid',
    selectedViewSelector: '#selected-view',
    selectedCardSelector: '#selected-card',
    titleSelector: '#origin-title',
    descriptionSelector: '#origin-description',
    scrollContainerSelector: '#scroll-container',
    resetButtonSelector: '#reset-button',
    apiEndpoint: 'origins.json',
    imageFolder: 'origins',
    pageUrl: 'origin.html',
    cardClass: 'origin-card'
  }).init();
});