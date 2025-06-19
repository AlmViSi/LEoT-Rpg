// scripts/selection.js

export class SelectionManager {
    constructor(options) {
        this.gridElement = document.querySelector(options.gridSelector);
        this.selectedViewElement = document.querySelector(options.selectedViewSelector);
        this.selectedCardElement = document.querySelector(options.selectedCardSelector);
        this.titleElement = document.querySelector(options.titleSelector);
        this.descriptionElement = document.querySelector(options.descriptionSelector);
        this.scrollContainerElement = document.querySelector(options.scrollContainerSelector);
        this.resetButtonElement = document.querySelector(options.resetButtonSelector);
        this.apiEndpoint = options.apiEndpoint;
        this.imageFolder = options.imageFolder;
        this.pageUrl = options.pageUrl;
        this.cardClass = options.cardClass; // 'race-card' or 'origin-card'

        this.data = []; // Будет хранить все данные (расы/происхождения)
        this.selectedItemId = null; // ID текущего выбранного элемента
    }

    async init() {
        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            this.data = await response.json();
            
            // Проверяем URL на наличие выбранного элемента при инициализации
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            if (id) {
                const item = this.data.find(d => d.id === id);
                if (item) {
                    this.renderSelectedView(item); // Рендерим выбранный вид, если ID есть
                } else {
                    console.warn(`Item with ID ${id} not found. Displaying grid.`);
                    this.showGrid(); // Показываем сетку, если ID не найден
                }
            } else {
                this.renderGrid(); // Рендерим сетку, если ID нет в URL
                this.showGrid(); // Показываем сетку по умолчанию
            }

            this.setupEventListeners();
        } catch (error) {
            console.error('Error fetching data or initializing:', error);
            // Можно добавить отображение ошибки на UI
            if (this.gridElement) {
                this.gridElement.innerHTML = `<p class="error-message">Ошибка загрузки данных: ${error.message}. Пожалуйста, попробуйте еще раз.</p>`;
                this.gridElement.style.display = 'block';
            }
        }
    }

    // Метод для отображения сетки выбора
    renderGrid() {
        if (!this.gridElement) {
            console.error('Grid element not found for rendering.');
            return;
        }
        this.gridElement.innerHTML = this.data.map(item => `
            <div class="${this.cardClass}" data-id="${item.id}">
                <img src="images/${this.imageFolder}/${item.src}" alt="${item.name}"
                     onerror="this.onerror=null;this.src='images/${this.imageFolder}/default.jpg'">
                <div class="overlay">${item.name}</div>
            </div>
        `).join('');
    }

    // Обработчик клика по карточке (как в сетке, так и в скролле)
    handleCardClick(id) {
        const item = this.data.find(d => d.id === id);
        if (item) {
            this.selectedItemId = id;
            // Обновляем URL без перезагрузки страницы
            history.pushState({ id: item.id }, '', `${this.pageUrl}?id=${item.id}`);
            this.renderSelectedView(item); // Рендерим новый выбранный вид
        } else {
            console.warn(`Attempted to select item with ID ${id}, but it was not found in data.`);
        }
    }

    // Метод для отображения выбранного элемента и связанных карточек
    renderSelectedView(item) {
        if (!this.selectedViewElement || !this.selectedCardElement || !this.titleElement || !this.descriptionElement || !this.scrollContainerElement || !this.resetButtonElement) {
            console.error('One or more selected view elements are missing.');
            return;
        }

        this.selectedViewElement.style.display = 'grid'; // Показываем выбранный вид
        this.gridElement.style.display = 'none'; // Скрываем сетку
        this.resetButtonElement.style.display = 'block'; // Показываем кнопку "Вернуться"

        // Очищаем предыдущее содержимое перед рендерингом нового
        this.selectedCardElement.innerHTML = '';
        this.scrollContainerElement.innerHTML = '';

        // 1. Рендерим большую выбранную карточку
        const mainImage = document.createElement('img');
        mainImage.src = `images/${this.imageFolder}/${item.src}`;
        mainImage.alt = item.name;
        // Обработка ошибок загрузки изображения
        mainImage.onerror = function() {
            this.onerror = null; // Предотвратить зацикливание
            this.src = `images/${this.imageFolder}/default.jpg`; // Путь к изображению-заглушке
        };
        this.selectedCardElement.appendChild(mainImage);

        // Добавляем лейбл для большой карточки
        const mainLabel = document.createElement('div');
        mainLabel.classList.add('overlay-label');
        mainLabel.textContent = item.name;
        this.selectedCardElement.appendChild(mainLabel);

        // 2. Рендерим заголовок и описание
        this.titleElement.textContent = item.name;
        this.descriptionElement.innerHTML = item.description;

        // 3. Рендерим контейнер прокрутки с маленькими карточками
        this.data.forEach(scrollItem => {
            // Обертка для карточки и ее лейбла
            const scrollItemWrapper = document.createElement('div');
            scrollItemWrapper.classList.add('scroll-item-wrapper');
            scrollItemWrapper.dataset.id = scrollItem.id; // ID на обертке
            scrollItemWrapper.addEventListener('click', () => this.handleCardClick(scrollItem.id));

            const scrollCard = document.createElement('div');
            scrollCard.classList.add('scroll-card');
            if (scrollItem.id === item.id) {
                scrollCard.classList.add('selected'); // Подсвечиваем текущую выбранную карточку
            }

            const scrollImage = document.createElement('img');
            scrollImage.src = `images/${this.imageFolder}/${scrollItem.src}`;
            scrollImage.alt = scrollItem.name;
            // Обработка ошибок загрузки изображения для скролл-карточек
            scrollImage.onerror = function() {
                this.onerror = null;
                this.src = `images/${this.imageFolder}/default.jpg`;
            };
            scrollCard.appendChild(scrollImage);

            // Лейбл под маленькой карточкой
            const scrollLabel = document.createElement('div');
            scrollLabel.classList.add('scroll-card-label');
            scrollLabel.textContent = scrollItem.name;

            scrollItemWrapper.appendChild(scrollCard);
            scrollItemWrapper.appendChild(scrollLabel); // Добавляем лейбл в обертку

            this.scrollContainerElement.appendChild(scrollItemWrapper);
        });
    }

    // Метод для возврата к сетке выбора
    showGrid() {
        if (!this.gridElement || !this.selectedViewElement || !this.resetButtonElement) {
            console.error('One or more core elements for grid view are missing.');
            return;
        }
        this.gridElement.style.display = 'grid'; // Показываем сетку
        this.selectedViewElement.style.display = 'none'; // Скрываем выбранный вид
        this.resetButtonElement.style.display = 'none'; // Скрываем кнопку "Вернуться"

        // Очищаем URL и сбрасываем выбранный ID
        history.pushState(null, '', this.pageUrl);
        this.selectedItemId = null;
    }

    // Установка всех слушателей событий
    setupEventListeners() {
        // Делегирование событий для карточек в основной сетке (gridElement)
        if (this.gridElement) {
            this.gridElement.addEventListener('click', (event) => {
                const card = event.target.closest(`.${this.cardClass}`);
                if (card) {
                    this.handleCardClick(card.dataset.id);
                }
            });
        } else {
            console.warn('Grid element not found, cannot set up click listener for grid cards.');
        }

        // Слушатель для кнопки "Вернуться"
        if (this.resetButtonElement) {
            this.resetButtonElement.addEventListener('click', () => this.showGrid());
        } else {
            console.warn('Reset button element not found, cannot set up click listener.');
        }

        // Обработка кнопки "Назад" в браузере (popstate)
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.id) {
                // Если в истории есть ID, рендерим соответствующий выбранный вид
                const item = this.data.find(d => d.id === event.state.id);
                if (item) {
                    this.renderSelectedView(item);
                } else {
                    // Если ID из истории не найден, показываем сетку
                    this.showGrid();
                }
            } else {
                // Если нет состояния или ID, или это корневая страница, показываем сетку
                this.showGrid();
            }
        });
    }
}