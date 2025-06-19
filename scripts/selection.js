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
        if (!this.validateElements()) {
            console.error('SelectionManager: Инициализация прервана из-за отсутствующих элементов DOM.');
            return; // Прекращаем выполнение, если элементы не найдены
        }
        
        await this.loadData(); // Это должно успешно загрузить данные
        this.setupEventListeners(); // Это прикрепляет обработчики кликов
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
            console.error('SelectionManager: Не найдены следующие элементы DOM:', missingElements.map(([name,]) => `${name} (${this.config[`${name}Selector`]})`));
            // Здесь можно добавить отображение ошибки на странице, если это критично для пользователя
            if (this.elements.grid) { // Если grid есть, можно в него вывести ошибку
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
            
            if (!Array.isArray(this.data) || this.data.length === 0) {
                console.warn(`SelectionManager: Загруженные данные из ${this.config.apiEndpoint} пусты или не являются массивом. Карточки не будут отрисованы.`);
                if (this.elements.grid) {
                    this.elements.grid.innerHTML = '<p class="info-message">Нет доступных элементов для отображения.</p>';
                }
                return; // Останавливаем выполнение, если данные пусты
            }
            
            console.log(`SelectionManager: Успешно загружено ${this.data.length} элементов из ${this.config.apiEndpoint}.`);
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
        console.log(`SelectionManager: Отображение выбранного элемента: ${item.name}`);

        this.elements.grid.style.display = 'none';
        this.elements.selectedView.style.display = 'grid'; // Используем grid
        this.elements.resetButton.style.display = 'block';

        this.elements.selectedCard.innerHTML = `<img src="images/${this.config.imageFolder}/${item.src}" alt="${item.name}">`;
        this.elements.title.textContent = item.name;
        this.elements.description.innerHTML = item.description.replace(/\n/g, '<br>'); // Поддержка переносов строк

        this.elements.scrollContainer.innerHTML = ''; // Очищаем перед рендерингом
        this.data.forEach(scrollItem => {
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
        if (this.elements.grid) {
            this.elements.grid.addEventListener('click', (e) => {
                const card = e.target.closest(`.${this.config.cardClass}`);
                if (!card) {
                    console.log('SelectionManager: Клик вне карточки.');
                    return;
                }
                
                const item = this.data.find(i => i.id === card.dataset.id);
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
                
                const item = this.data.find(i => i.id === card.dataset.id);
                if (item) {
                    this.showSelected(item);
                    // Прокрутка выбранной карточки в центр
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
        const item = id ? this.data.find(item => item.id === id) : null;
        
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
            const item = this.data.find(item => item.id === id);
            if (item) {
                this.showSelected(item);
            } else {
                console.warn(`SelectionManager: Элемент с ID "${id}" не найден в данных. Сброс выбора.`);
                this.resetSelection(); // Сброс, если ID не найден
            }
        }
    }
}