// scripts/character.js

// Получаем глобально доступный экземпляр базы данных, который был установлен в firebase-init.js
// ЭТА СТРОКА ДОЛЖНА БЫТЬ В НАЧАЛЕ ФАЙЛА
const database = window.database; 

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - проверяем их наличие при получении
    const portraitUpload = document.getElementById('portrait-upload');
    const portraitContainer = document.getElementById('character-portrait');
    const statButtons = document.querySelectorAll('.stat-btn');
    const pointsLeftElement = document.getElementById('points-left');
    const loadUidInput = document.getElementById('load-uid-input');
    const characterNameInput = document.getElementById('character-name');
    const characterBioInput = document.getElementById('character-bio');
    const characterUidDisplay = document.getElementById('character-uid'); // Для отображения/генерации UID

    // Проверка, что основные элементы DOM найдены
    if (!portraitUpload || !portraitContainer || !pointsLeftElement || !loadUidInput || !characterNameInput || !characterBioInput || !characterUidDisplay) {
        console.error("One or more required DOM elements not found. Please check character.html for correct IDs.");
        alert("Ошибка: Не найдены необходимые элементы на странице. Проверьте HTML-код.");
        return; // Прекращаем выполнение скрипта, если элементы не найдены
    }
    
    // Character state
    let pointsLeft = 36;
    const stats = {
        str: 0,
        con: 0,
        dex: 0,
        agi: 0,
        int: 0,
        wis: 0,
        cha: 0
    };
    
    // Event Listeners
    portraitContainer.addEventListener('click', () => portraitUpload.click());
    
    portraitUpload.addEventListener('change', handlePortraitUpload);
    document.getElementById('generate-uid-btn').addEventListener('click', generateCharacterUID);
    document.getElementById('save-character-btn').addEventListener('click', saveCharacter);
    document.getElementById('load-character-btn').addEventListener('click', loadCharacter);
    document.getElementById('clear-character-btn').addEventListener('click', resetCharacter);
    
    statButtons.forEach(button => {
        button.addEventListener('click', handleStatButtonClick);
    });

    // Initialize
    initParticles(); // Убедитесь, что particles.js загружен до character.js, если эта функция используется
    updateStats();

    // Functions
    function handlePortraitUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                portraitContainer.innerHTML = `<img src="${event.target.result}" alt="Character Portrait">`;
            };
            reader.readAsDataURL(file);
        }
    }

    function generateCharacterUID() {
        // Генерируем уникальный ID для персонажа
        const uid = Date.now().toString(36) + Math.random().toString(36).substring(2);
        characterUidDisplay.value = uid;
    }

    function updateStats() {
        // Обновление отображения оставшихся очков
        pointsLeftElement.textContent = pointsLeft;

        // Обновление значений характеристик
        document.getElementById('str-value').textContent = stats.str;
        document.getElementById('con-value').textContent = stats.con;
        document.getElementById('dex-value').textContent = stats.dex;
        document.getElementById('agi-value').textContent = stats.agi;
        document.getElementById('int-value').textContent = stats.int;
        document.getElementById('wis-value').textContent = stats.wis;
        document.getElementById('cha-value').textContent = stats.cha;

        // Обновление производных характеристик (примеры расчетов)
        document.getElementById('combat-value').textContent = stats.str + stats.dex;
        document.getElementById('logic-value').textContent = stats.int + stats.wis;
        document.getElementById('composure-value').textContent = stats.wis + stats.cha;
        document.getElementById('willpower-value').textContent = stats.int + stats.con;
        document.getElementById('resilience-value').textContent = stats.con + stats.str;
        document.getElementById('evasion-value').textContent = stats.agi + stats.dex;
    }

    function handleStatButtonClick(event) {
        const statType = event.target.dataset.stat; // 'str', 'con', etc.
        const action = event.target.dataset.action; // 'increase' or 'decrease'

        if (action === 'increase' && pointsLeft > 0) {
            stats[statType]++;
            pointsLeft--;
        } else if (action === 'decrease' && stats[statType] > 0) {
            stats[statType]--;
            pointsLeft++;
        }
        updateStats();
    }

    function saveCharacter() {
        // Проверка инициализации базы данных
        if (!database) {
            console.error("Firebase database is not initialized. Cannot save character.");
            alert('Ошибка: База данных не готова. Попробуйте обновить страницу.');
            return;
        }

        const charUID = characterUidDisplay.value;
        if (!charUID) {
            alert('Пожалуйста, сгенерируйте UID персонажа!');
            return;
        }

        const characterData = {
            name: characterNameInput.value,
            bio: characterBioInput.value,
            stats: { ...stats }, // Копируем характеристики
            pointsLeft: pointsLeft,
            portrait: portraitContainer.querySelector('img')?.src || null // Сохраняем портрет в Base64
        };

        database.ref('characters/' + charUID).set(characterData)
            .then(() => {
                alert('Персонаж успешно сохранен!');
            })
            .catch(error => {
                console.error('Ошибка при сохранении персонажа:', error);
                alert(`Ошибка при сохранении персонажа: ${error.message}. Проверьте правила доступа Firebase.`);
            });
    }

async function loadCharacter() {
    try {
        // 1. Проверка инициализации Firebase
        if (!firebase.apps.length || !database) {
            throw new Error("База данных Firebase не инициализирована");
        }

        // 2. Безопасное получение элемента ввода
        const loadUidInput = document.getElementById('load-uid-input');
        if (!loadUidInput) {
            throw new Error("Элемент для ввода UID не найден");
        }

        // 3. Получение и валидация UID
        const charUID = typeof loadUidInput.value === 'string' 
            ? loadUidInput.value.trim() 
            : String(loadUidInput.value || '').trim();

        if (!charUID) {
            alert('Пожалуйста, введите UID персонажа');
            return;
        }

        // 4. Проверка необходимых DOM-элементов
        const elements = {
            nameInput: document.getElementById('character-name-input'),
            bioInput: document.getElementById('character-bio-input'),
            uidDisplay: document.getElementById('character-uid-display'),
            portrait: document.getElementById('portrait-container'),
            statsContainer: document.getElementById('stats-container')
        };

        for (const [name, element] of Object.entries(elements)) {
            if (!element) throw new Error(`Не найден элемент: ${name}`);
        }

        // 5. Загрузка данных из Firebase
        const snapshot = await database.ref(`characters/${charUID}`).once('value');
        
        if (!snapshot.exists()) {
            alert('Персонаж с таким UID не найден');
            return;
        }

        const characterData = snapshot.val();

        // 6. Восстановление данных персонажа
        elements.nameInput.value = characterData.name || '';
        elements.bioInput.value = characterData.bio || '';
        elements.uidDisplay.value = charUID;

        // 7. Восстановление характеристик
        if (characterData.stats) {
            for (const [stat, value] of Object.entries(characterData.stats)) {
                if (stats.hasOwnProperty(stat)) {
                    stats[stat] = Number(value) || 0;
                }
            }
            updateStats(); // Обновляем отображение характеристик
        }

        // 8. Восстановление портрета
        elements.portrait.innerHTML = characterData.portrait
            ? `<img src="${characterData.portrait}" alt="Портрет" class="portrait-img">`
            : '<div class="no-portrait">Нет портрета</div>';

        alert('Персонаж успешно загружен!');
        
    } catch (error) {
        console.error('Ошибка загрузки персонажа:', error);
        alert(`Ошибка: ${error.message}`);
    }
}
    
    function resetCharacter() {
        if (!confirm('Вы уверены, что хотите очистить все данные персонажа?')) return;
        
        // Сброс характеристик
        Object.keys(stats).forEach(stat => stats[stat] = 0);
        pointsLeft = 36;
        
        // Очистка полей
        characterNameInput.value = '';
        characterBioInput.value = '';
        characterUidDisplay.value = '';
        loadUidInput.value = '';
        portraitContainer.innerHTML = '<span>Нажмите, чтобы загрузить портрет</span>';
        portraitUpload.value = ''; // Сброс выбранного файла в инпуте типа file
        
        updateStats();
    }
});