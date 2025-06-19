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
    console.log('Initializing SelectionManager with config:', this.config);
    this.getDOMElements();
    
    if (!this.validateElements()) {
      console.error('Missing elements:', Object.entries(this.elements)
        .filter(([_, el]) => !el).map(([name]) => name));
      return;
    }
    
    await this.loadData();
    this.setupEventListeners();
    this.checkUrlForId();
    console.log('Initialization complete. Data:', this.data);
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
      if (!el) console.error('Element not found:', el);
      return el;
    });
  }

  async loadData() {
    try {
      const response = await fetch(this.config.apiEndpoint);
      if (!response.ok) throw new Error(`Failed to load ${this.config.apiEndpoint}`);
      
      this.data = await response.json();
      
      // Нормализуем ID к строковому типу
      this.data = this.data.map(item => ({
        ...item,
        id: item.id.toString()
      }));
      
      this.renderGrid();
      this.renderScrollCards();
    } catch (error) {
      console.error('Data loading error:', error);
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
  }

  renderScrollCards() {
    this.elements.scrollContainer.innerHTML = this.data.map(item => `
      <div class="scroll-card" data-id="${item.id}">
        <img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}"
             onerror="this.onerror=null;this.src='images/${this.config.imageFolder}/default.jpg'">
        <div class="overlay">${item.name}</div>
      </div>
    `).join('');
  }

  showSelected(item) {
    if (!item) {
      console.error('No item provided to showSelected');
      return;
    }

    console.log('Showing selected item:', item);

    this.elements.grid.style.display = 'none';
    this.elements.selectedView.style.display = 'flex';
    this.elements.resetButton.style.display = 'block';

    this.elements.selectedCard.innerHTML = `
      <img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}"
           onerror="this.onerror=null;this.src='images/${this.config.imageFolder}/default.jpg'">
    `;
    this.elements.title.textContent = item.name;
    this.elements.description.textContent = item.description;

    // Обновляем выделение
    document.querySelectorAll('.scroll-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.id === item.id);
      if (card.dataset.id === item.id) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    window.history.pushState({ selectedId: item.id }, '', `${this.config.pageUrl}?id=${item.id}`);
  }

  setupEventListeners() {
    // Делегирование событий для grid
    this.elements.grid.addEventListener('click', (e) => {
      const card = e.target.closest(`.${this.config.cardClass}`);
      if (!card) return;
      
      const itemId = card.dataset.id;
      const item = this.data.find(i => i.id === itemId);
      
      if (item) {
        this.showSelected(item);
      } else {
        console.error('Item not found for ID:', itemId);
      }
    });

    // Делегирование событий для scroll-container
    this.elements.scrollContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.scroll-card');
      if (!card) return;
      
      const itemId = card.dataset.id;
      const item = this.data.find(i => i.id === itemId);
      
      if (item) this.showSelected(item);
    });

    // Кнопка сброса
    this.elements.resetButton.addEventListener('click', () => this.resetSelection());
    
    // Навигация по истории
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