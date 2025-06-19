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
        return true;
    }

    async loadData() {
        try {
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            this.data = await response.json();
            if (!Array.isArray(this.data) || this.data.length === 0) {
                throw new Error('Данные пусты или не являются массивом');
            }
            
            this.renderGrid();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            if (this.elements.grid) {
                this.elements.grid.innerHTML = `<p class="error-message">Ошибка загрузки данных: ${error.message}</p>`;
            }
        }
    }

    renderGrid() {
        this.elements.grid.innerHTML = this.data.map(item => `
            <div class="${this.config.cardClass}" data-id="${item.id}">
                <img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}"
                     onerror="this.onerror=null;this.src='images/default.jpg'">
                <div class="overlay">${item.name}</div>
            </div>
        `).join('');
    }

    showSelected(item) {
        this.elements.grid.style.display = 'none';
        this.elements.selectedView.style.display = 'grid';
        this.elements.resetButton.style.display = 'block';

        this.elements.selectedCard.innerHTML = `<img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}">`;
        this.elements.title.textContent = item.name;
        this.elements.description.innerHTML = item.description.replace(/\n/g, '<br>');

        // Очищаем и заполняем scroll-container
        this.elements.scrollContainer.innerHTML = this.data
            .filter(scrollItem => scrollItem.id !== item.id && scrollItem.src)
            .map(scrollItem => `
                <div class="scroll-card" data-id="${scrollItem.id}">
                    <img src="images/${this.config.imageFolder}/${scrollItem.src}" alt="${scrollItem.name}">
                </div>
            `).join('');

        // Плавный скролл к выбранному элементу
        setTimeout(() => {
            const selectedCard = this.elements.scrollContainer.querySelector(`[data-id="${item.id}"]`);
            if (selectedCard) {
                selectedCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }, 100);

        window.history.pushState({ id: item.id }, '', `${this.config.pageUrl}?id=${item.id}`);
    }

    setupEventListeners() {
        // Обработчик кликов по сетке
        this.elements.grid?.addEventListener('click', (e) => {
            const card = e.target.closest(`.${this.config.cardClass}`);
            if (!card) return;
            
            const item = this.data.find(i => i.id == card.dataset.id);
            if (item) this.showSelected(item);
        });

        // Обработчик кликов по миниатюрам
        this.elements.scrollContainer?.addEventListener('click', (e) => {
            const card = e.target.closest('.scroll-card');
            if (!card) return;
            
            const item = this.data.find(i => i.id == card.dataset.id);
            if (item) {
                this.showSelected(item);
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });

        // Кнопка сброса
        this.elements.resetButton?.addEventListener('click', () => this.resetSelection());

        // Обработчик навигации по истории
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
        const item = id ? this.data.find(item => item.id == id) : null;
        
        item ? this.showSelected(item) : this.resetSelection();
    }

    checkUrlForId() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id) {
            const item = this.data.find(item => item.id == id);
            item ? this.showSelected(item) : this.resetSelection();
        }
    }
}