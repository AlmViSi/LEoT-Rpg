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
        if (!this.validateElements()) {
            console.error('SelectionManager: Инициализация прервана из-за отсутствующих элементов DOM.');
            return;
        }
        
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
        const missingElements = Object.entries(this.elements).filter(([, el]) => !el);
        if (missingElements.length > 0) {
            console.error('SelectionManager: Не найдены следующие элементы DOM:', missingElements.map(([name,]) => `${name} (${this.config[`${name}Selector`]})`));
            if (this.elements.grid) {
                 this.elements.grid.innerHTML = `<p class="error-message">Ошибка: Необходимые элементы страницы не найдены. Проверьте HTML.</p>`;
            }
            return false;
        }
        console.log('SelectionManager: Все необходимые элементы DOM найдены.');
        return true;
    }

    async loadData() {
        try {
            console.log(`SelectionManager: Попытка загрузки данных из: ${this.config.apiEndpoint}`);
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} от ${this.config.apiEndpoint}`);
            }
            this.data = await response.json();
            console.log('Загруженные данные:', this.data);
            
            if (!Array.isArray(this.data) || this.data.length === 0) {
                console.warn(`SelectionManager: Загруженные данные из ${this.config.apiEndpoint} пусты или не являются массивом.`);
                if (this.elements.grid) {
                    this.elements.grid.innerHTML = '<p class="info-message">Нет доступных элементов для отображения.</p>';
                }
                return;
            }
            
            console.log(`SelectionManager: Успешно загружено ${this.data.length} элементов.`);
            this.renderGrid();
        } catch (error) {
            console.error('SelectionManager: Ошибка загрузки данных:', error);
            if (this.elements.grid) {
                this.elements.grid.innerHTML = `<p class="error-message">Ошибка загрузки данных: ${error.message}</p>`;
            }
        }
    }

    renderGrid() {
        if (!this.elements.grid) {
            console.error('SelectionManager: Элемент сетки для рендеринга не найден.');
            return;
        }
        if (!this.data || this.data.length === 0) {
            console.warn('SelectionManager: Нет данных для отрисовки сетки.');
            return;
        }
        this.elements.grid.innerHTML = this.data.map(item => `
            <div class="${this.config.cardClass}" data-id="${item.id}">
                <img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}"
                     onerror="this.onerror=null;this.src='images/default.jpg'">
                <div class="overlay">${item.name}</div>
            </div>
        `).join('');
        console.log('SelectionManager: Сетка отрисована.');
    }

    showSelected(item) {
        if (!item) {
            console.error('SelectionManager: Попытка показать выбранный элемент без данных.');
            return;
        }
        console.log(`SelectionManager: Отображение выбранного элемента: ${item.name} (ID: ${item.id})`);

        this.elements.grid.style.display = 'none';
        this.elements.selectedView.style.display = 'grid';
        this.elements.resetButton.style.display = 'block';

        this.elements.selectedCard.innerHTML = `<img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}">`;
        this.elements.title.textContent = item.name;
        this.elements.description.innerHTML = item.description.replace(/\n/g, '<br>');

        this.elements.scrollContainer.innerHTML = '';
        this.data.forEach(scrollItem => {
            if (scrollItem.id != item.id && scrollItem.src) {
                const scrollCard = document.createElement('div');
                scrollCard.classList.add('scroll-card');
                scrollCard.dataset.id = scrollItem.id;
                scrollCard.innerHTML = `<img src="images/${this.config.imageFolder}/${scrollItem.src}" alt="${scrollItem.name}">`;
                this.elements.scrollContainer.appendChild(scrollCard);
            }
        });

        window.history.pushState({ id: item.id }, '', `${this.config.pageUrl}?id=${item.id}`);
    }

    setupEventListeners() {
        if (this.elements.grid) {
            this.elements.grid.addEventListener('click', (e) => {
                const card = e.target.closest(`.${this.config.cardClass}`);
                if (!card) {
                    console.log('SelectionManager: Клик вне карточки.');
                    return;
                }
                
                const item = this.data.find(i => i.id == card.dataset.id);
                if (item) {
                    this.showSelected(item);
                } else {
                    console.warn(`SelectionManager: Элемент с ID ${card.dataset.id} не найден в данных.`);
                }
            });
            console.log(`SelectionManager: Обработчик кликов на ${this.config.gridSelector} установлен.`);
        }

        if (this.elements.scrollContainer) {
            this.elements.scrollContainer.addEventListener('click', (e) => {
                const card = e.target.closest('.scroll-card');
                if (!card) return;
                
                const item = this.data.find(i => i.id == card.dataset.id);
                if (item) {
                    this.showSelected(item);
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
            console.log('SelectionManager: Обработчик кликов на scrollContainer установлен.');
        }

        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener('click', () => this.resetSelection());
            console.log('SelectionManager: Обработчик кликов на reset-button установлен.');
        }
        window.addEventListener('popstate', () => this.handleHistoryNavigation());
        console.log('SelectionManager: Обработчик popstate установлен.');
    }

    resetSelection() {
        console.log('SelectionManager: Сброс выбора.');
        this.elements.grid.style.display = 'grid';
        this.elements.selectedView.style.display = 'none';
        this.elements.resetButton.style.display = 'none';
        window.history.pushState({}, '', this.config.pageUrl);
    }

    handleHistoryNavigation() {
        console.log('SelectionManager: Обработка навигации по истории.');
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const item = id ? this.data.find(item => item.id == id) : null;
        
        if (item) {
            this.showSelected(item);
        } else {
            this.resetSelection();
        }
    }

    checkUrlForId() {
        console.log('SelectionManager: Проверка URL на наличие ID.');
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id) {
            const item = this.data.find(item => item.id == id);
            if (item) {
                this.showSelected(item);
            } else {
                console.warn(`SelectionManager: Элемент с ID "${id}" не найден. Доступные ID: ${this.data.map(i => i.id).join(', ')}`);
                this.resetSelection();
            }
        }
    }
}