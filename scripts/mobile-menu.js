document.addEventListener('DOMContentLoaded', function() {
// Создаем элементы мобильного меню
const mobileMenuBtn = document.createElement('button');
mobileMenuBtn.className = 'mobile-menu-btn';
mobileMenuBtn.textContent = 'Меню';

const mobileMenuContainer = document.createElement('div');
mobileMenuContainer.className = 'mobile-menu-container';

const mobileMenuHeader = document.createElement('div');
mobileMenuHeader.className = 'mobile-menu-header';

const mobileMenuTitle = document.createElement('h2');
mobileMenuTitle.textContent = 'Lost Edge of Time';

const mobileMenuClose = document.createElement('button');
mobileMenuClose.className = 'mobile-menu-close';
mobileMenuClose.innerHTML = '&times;';

const mobileMenuTabs = document.createElement('div');
mobileMenuTabs.className = 'mobile-menu-tabs';

// Добавляем элементы в DOM
mobileMenuHeader.appendChild(mobileMenuTitle);
mobileMenuHeader.appendChild(mobileMenuClose);
mobileMenuContainer.appendChild(mobileMenuHeader);
mobileMenuContainer.appendChild(mobileMenuTabs);

// Вставляем кнопку меню после заголовка
const header = document.querySelector('header');
if (header) {
    header.parentNode.insertBefore(mobileMenuBtn, header.nextSibling);
}

// Вставляем контейнер меню в конец body
document.body.appendChild(mobileMenuContainer);

// Копируем вкладки из основного меню
const tabs = document.querySelectorAll('.tab-container .tab');
tabs.forEach(tab => {
    const mobileTab = document.createElement('a');
    mobileTab.className = 'mobile-menu-tab';
    mobileTab.href = tab.href;
    mobileTab.textContent = tab.textContent;
    if (tab.classList.contains('active')) {
        mobileTab.classList.add('active');
    }
    mobileMenuTabs.appendChild(mobileTab);
});

// Добавляем обработчики событий
mobileMenuBtn.addEventListener('click', function() {
    mobileMenuContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

mobileMenuClose.addEventListener('click', function() {
    mobileMenuContainer.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Закрытие меню при клике вне его области
mobileMenuContainer.addEventListener('click', function(e) {
    if (e.target === mobileMenuContainer) {
        mobileMenuContainer.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
});
