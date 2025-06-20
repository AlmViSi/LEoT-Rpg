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
        this.currentSelectedId = null;
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
        const missingElements = Object.entries(this.elements).filter(([, el]) => !el);
        if (missingElements.length > 0) {
            console.error('Missing elements:', missingElements.map(([name]) => name));
            if (this.elements.grid) {
                this.elements.grid.innerHTML = `<p class="error-message">Ошибка: Необходимые элементы не найдены</p>`;
            }
            return false;
        }
        return true;
    }

    async loadData() {
        try {
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            
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
            <div class="${this.config.cardClass}" data-id="${item.id}" role="button" tabindex="0"
                 aria-label="Выбрать ${item.name}">
                <img src="images/${this.config.imageFolder}/${item.src}" 
                     alt="${item.name}"
                     aria-hidden="true"
                     onerror="this.onerror=null;this.src='images/default.jpg'">
                <div class="overlay">${item.name}</div>
            </div>
        `).join('');
    }
    
    showSelected(item) {
        if (!item) return;
        this.currentSelectedId = item.id;

        this.elements.grid.style.display = 'none';
        this.elements.selectedView.style.display = 'grid';
        this.elements.resetButton.style.display = 'block';

        // Обновленный HTML для selected-card с подписью
        this.elements.selectedCard.innerHTML = `
            <img src="images/${this.config.imageFolder}/${item.src}" 
                 alt="${item.name}"
                 aria-hidden="true">
            <div class="selected-card-label">${item.name}</div>
        `;
    
        this.elements.title.textContent = item.name;
        this.elements.description.innerHTML = item.description.replace(/\n/g, '<br>');

        // Обновленный HTML для scroll-container с подписями
        this.elements.scrollContainer.innerHTML = this.data
            .filter(scrollItem => scrollItem.id !== item.id && scrollItem.src)
            .map(scrollItem => `
                <div class="scroll-card" data-id="${scrollItem.id}" role="button" tabindex="0"
                     aria-label="Альтернативный вариант: ${scrollItem.name}">
                    <img src="images/${this.config.imageFolder}/${scrollItem.src}" 
                         alt="${scrollItem.name}"
                         aria-hidden="true">
                    <div class="scroll-card-label">${scrollItem.name}</div>
                </div>
            `).join('');

        this.autoScrollToSelected();
        window.history.pushState({ id: item.id }, '', `${this.config.pageUrl}?id=${item.id}`);
    }
    
    autoScrollToSelected() {
        if (!this.currentSelectedId) return;

        setTimeout(() => {
            const cards = Array.from(this.elements.scrollContainer.querySelectorAll('.scroll-card'));
            const selectedIndex = cards.findIndex(card => card.dataset.id === this.currentSelectedId);
            
            if (selectedIndex === -1) return;

            const containerWidth = this.elements.scrollContainer.offsetWidth;
            const cardWidth = cards[0].offsetWidth;
            const gap = 16; // Примерный отступ между карточками
            const scrollPosition = (cardWidth + gap) * selectedIndex - (containerWidth / 2) + (cardWidth / 2);
            
            this.elements.scrollContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }, 100);
    }

    setupEventListeners() {
        // Клики по основной сетке
        this.elements.grid?.addEventListener('click', (e) => {
            const card = e.target.closest(`.${this.config.cardClass}`);
            if (!card) return;
            
            const item = this.data.find(i => i.id == card.dataset.id);
            if (item) this.showSelected(item);
        });

        // Клики по миниатюрам в scroll-container
        this.elements.scrollContainer?.addEventListener('click', (e) => {
            const card = e.target.closest('.scroll-card');
            if (!card) return;
            
            const item = this.data.find(i => i.id == card.dataset.id);
            if (item) {
                this.currentSelectedId = item.id;
                this.showSelected(item);
            }
        });

        // Кнопка сброса
        this.elements.resetButton?.addEventListener('click', () => {
            this.currentSelectedId = null;
            this.resetSelection();
        });

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
