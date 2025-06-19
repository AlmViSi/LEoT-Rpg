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
            cardClass: '', // Например, 'origin-card' или 'race-card'
            ...config
        };

        this.elements = {};
        this.data = [];
    }

    async init() {
        this.getDOMElements();
        if (!this.validateElements()) return; // Проверка наличия элементов DOM
        
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
        // Проверяем, что все нужные элементы DOM найдены
        const missingElements = Object.entries(this.elements).filter(([, el]) => !el);
        if (missingElements.length > 0) {
            console.error('SelectionManager: Не найдены следующие элементы DOM:', missingElements.map(([name]) => name));
            // Здесь можно добавить отображение ошибки на странице
            return false;
        }
        return true;
    }

    async loadData() {
        try {
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            this.data = await response.json();
            if (!Array.isArray(this.data) || this.data.length === 0) {
                throw new Error('Данные пусты или имеют неверный формат');
            }
            this.renderGrid();
        } catch (error) {
            console.error('SelectionManager: Ошибка загрузки данных:', error);
            // Отобразить сообщение об ошибке пользователю, если возможно
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
        this.elements.selectedView.style.display = 'grid'; // Используем grid
        this.elements.resetButton.style.display = 'block';

        this.elements.selectedCard.innerHTML = `<img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}">`;
        this.elements.title.textContent = item.name;
        this.elements.description.innerHTML = item.description.replace(/\n/g, '<br>'); // Поддержка переносов строк

        this.elements.scrollContainer.innerHTML = ''; // Очищаем перед рендерингом
        this.data.forEach(scrollItem => {
            // Check if scrollItem has a 'src' property to render its image
            if (scrollItem.id !== item.id && scrollItem.src) { // Не отображаем текущий выбранный элемент в скролле
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
        this.elements.grid.addEventListener('click', (e) => {
            const card = e.target.closest(`.${this.config.cardClass}`);
            if (!card) return;
            
            const item = this.data.find(i => i.id === card.dataset.id);
            if (item) this.showSelected(item);
        });

        this.elements.scrollContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.scroll-card');
            if (!card) return;
            
            const item = this.data.find(i => i.id === card.dataset.id);
            if (item) {
                this.showSelected(item);
                // Scroll the clicked card into view
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });

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
            if (item) {
                this.showSelected(item);
            } else {
                console.warn(`Item with ID "${id}" not found.`);
                this.resetSelection(); // Сброс, если ID не найден
            }
        }
    }
}