// scripts/selection.js
export class SelectionManager {
  constructor(config) {
    this.config = {
      gridSelector: '',
      selectedViewSelector: '',
      selectedCardSelector: '',
      titleSelector: '',
      descriptionSelector: '',
      scrollContainerSelector: '',
      resetButtonSelector: '',
      apiEndpoint: '',
      imageFolder: '',
      pageUrl: '',
      cardClass: '',
      ...config
    };

    this.elements = {};
    this.data = [];
  }

  async init() {
    this.getDOMElements();
    if (!this.validateElements()) return;
    
    await this.loadData();
    this.setupEventListeners();
    this.checkUrlForId();
  }

  getDOMElements() {
    this.elements = {
      grid: document.querySelector(this.config.gridSelector),
      selectedView: document.querySelector(this.config.selectedViewSelector),
      selectedCard: document.querySelector(this.config.selectedCardSelector),
      title: document.querySelector(this.config.titleSelector),
      description: document.querySelector(this.config.descriptionSelector),
      scrollContainer: document.querySelector(this.config.scrollContainerSelector),
      resetButton: document.querySelector(this.config.resetButtonSelector)
    };
  }

  validateElements() {
    return Object.values(this.elements).every(el => {
      if (!el) console.error('Элемент не найден:', el);
      return el;
    });
  }

  async loadData() {
    try {
      const response = await fetch(this.config.apiEndpoint);
      if (!response.ok) throw new Error(`Failed to load ${this.config.apiEndpoint}`);
      this.data = await response.json();
      
      this.renderGrid();
      this.renderScrollCards();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }

  renderGrid() {
    this.elements.grid.innerHTML = this.data.map(item => `
      <div class="${this.config.cardClass}" data-id="${item.id}">
        <img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}"
             onerror="this.onerror=null;this.src='images/${this.config.imageFolder}/default.jpg'">
        <div class="overlay">${item.name}</div>
      </div>
    `).join('');

    this.elements.grid.querySelectorAll(`.${this.config.cardClass}`).forEach(card => {
      card.addEventListener('click', () => this.showSelected(
        this.data.find(item => item.id === card.dataset.id)
      ));
    });
  }

  renderScrollCards() {
    this.elements.scrollContainer.innerHTML = this.data.map(item => `
      <div class="scroll-card" data-id="${item.id}">
        <img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}"
             onerror="this.onerror=null;this.src='images/${this.config.imageFolder}/default.jpg'">
        <div class="overlay">${item.name}</div>
      </div>
    `).join('');

    this.elements.scrollContainer.querySelectorAll('.scroll-card').forEach(card => {
      card.addEventListener('click', () => this.showSelected(
        this.data.find(item => item.id === card.dataset.id)
      ));
    });
  }

  showSelected(item) {
    if (!item) return;

    this.elements.grid.style.display = 'none';
    this.elements.selectedView.style.display = 'flex';
    this.elements.resetButton.style.display = 'block';

    this.elements.selectedCard.innerHTML = `
      <img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}"
           onerror="this.onerror=null;this.src='images/${this.config.imageFolder}/default.jpg'">
    `;
    this.elements.title.textContent = item.name;
    this.elements.description.textContent = item.description;

    document.querySelectorAll('.scroll-card').forEach(card => {
      const isSelected = card.dataset.id === item.id;
      card.classList.toggle('selected', isSelected);
      if (isSelected) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    window.history.pushState({ selectedId: item.id }, '', `${this.config.pageUrl}?id=${item.id}`);
  }

  setupEventListeners() {
    this.elements.resetButton.addEventListener('click', () => this.resetSelection());
    window.addEventListener('popstate', () => this.handleHistoryNavigation());
  }

  resetSelection() {
    this.elements.grid.style.display = 'grid';
    this.elements.selectedView.style.display = 'none';
    this.elements.resetButton.style.display = 'none';
    window.history.pushState({}, '', this.config.pageUrl);
  }

  handleHistoryNavigation() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const item = id ? this.data.find(item => item.id === id) : null;
    
    if (item) {
      this.showSelected(item);
    } else {
      this.resetSelection();
    }
  }

  checkUrlForId() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      const item = this.data.find(item => item.id === id);
      if (item) this.showSelected(item);
    }
  }
}