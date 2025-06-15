// --- Глобальные переменные ---
const database = firebase.database();

let allSpells = []; // Все заклинания из JSON
let currentCharacterId = 'testCharacter1'; // TODO: Замените на реальный ID персонажа (например, из localStorage или URL)
let currentManagedSpells = {}; // Объект для управления выбранными заклинаниями
let currentLanguage = localStorage.getItem('language') || 'en'; // Язык по умолчанию

// --- Тексты для локализации ---
const texts = {
    en: {
        title: "Spell Constructor",
        powersetsTitle: "Power Sets",
        managedSpellsTitle: "Managed Power Sets for Character",
        filterNamePlaceholder: "Search by Name...",
        filterPowerSetDefault: "All Power Sets",
        filterPowerSetTreeDefault: "All Power Set Trees",
        filterTypeDefault: "All Types",
        addToCharacterButton: "Add Selected to Character",
        saveCharacterPowersetsButton: "Save Character's Power Sets",
        spellAdded: "Spell added to character's managed list!",
        spellRemoved: "Spell removed from character's managed list!",
        noSpellSelected: "No spell selected to add.",
        powersetsSaved: "Character's Power Sets saved successfully!",
        errorSaving: "Error saving character's Power Sets:",
        errorLoading: "Error loading Power Sets data:",
        errorFetchingJson: "Error fetching powersets.json:",
        errorLoadingCharacterPowersets: "Error loading character's Power Sets:",
        addSpell: "Add Spell",
        removeSpell: "Remove Spell"
    },
    ru: {
        title: "Конструктор Заклинаний",
        powersetsTitle: "Наборы Сил",
        managedSpellsTitle: "Выбранные Наборы Сил для Персонажа",
        filterNamePlaceholder: "Поиск по имени...",
        filterPowerSetDefault: "Все Наборы Сил",
        filterPowerSetTreeDefault: "Все Ветви Наборов Сил",
        filterTypeDefault: "Все Типы",
        addToCharacterButton: "Добавить выбранное персонажу",
        saveCharacterPowersetsButton: "Сохранить Наборы Сил персонажа",
        spellAdded: "Заклинание добавлено в список персонажа!",
        spellRemoved: "Заклинание удалено из списка персонажа!",
        noSpellSelected: "Не выбрано заклинание для добавления.",
        powersetsSaved: "Наборы Сил персонажа успешно сохранены!",
        errorSaving: "Ошибка сохранения Наборов Сил персонажа:",
        errorLoading: "Ошибка загрузки данных Наборов Сил:",
        errorFetchingJson: "Ошибка получения powersets.json:",
        errorLoadingCharacterPowersets: "Ошибка загрузки Наборов Сил персонажа:",
        addSpell: "Добавить Заклинание",
        removeSpell: "Удалить Заклинание"
    }
};

// --- Функции локализации ---
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    applyTexts();
    updateSpellList(); // Обновить списки после смены языка
    showManagedList(); // Обновить список выбранных заклинаний
}

function applyTexts() {
    document.getElementById('title').textContent = texts[currentLanguage].title;
    document.getElementById('powersets-title').textContent = texts[currentLanguage].powersetsTitle;
    document.getElementById('managed-spells-title').textContent = texts[currentLanguage].managedSpellsTitle;
    document.getElementById('filter-name').placeholder = texts[currentLanguage].filterNamePlaceholder;
    document.getElementById('add-to-character-button').textContent = texts[currentLanguage].addToCharacterButton;
    document.getElementById('save-character-powersets').textContent = texts[currentLanguage].saveCharacterPowersetsButton;
    
    // Обновить тексты в выпадающих списках, если они уже заполнены
    const filterPowerSet = document.getElementById('filter-power-set');
    if (filterPowerSet.options[0]) {
        filterPowerSet.options[0].textContent = texts[currentLanguage].filterPowerSetDefault;
    }
    const filterPowerSetTree = document.getElementById('filter-power-set-tree');
    if (filterPowerSetTree.options[0]) {
        filterPowerSetTree.options[0].textContent = texts[currentLanguage].filterPowerSetTreeDefault;
    }
    const filterType = document.getElementById('filter-type');
    if (filterType.options[0]) {
        filterType.options[0].textContent = texts[currentLanguage].filterTypeDefault;
    }
}

// --- Функции Firebase ---

/**
 * Сохраняет выбранные Power Sets для текущего персонажа в Firebase.
 * @param {Object} managedSpells Объект с выбранными заклинаниями.
 */
async function saveCharacterPowerSets(managedSpells) {
    if (!currentCharacterId) {
        console.warn("Character ID not set. Cannot save Power Sets.");
        return;
    }
    try {
        await database.ref('characters/' + currentCharacterId + '/powersets').set(managedSpells);
        console.log(texts[currentLanguage].powersetsSaved);
        alert(texts[currentLanguage].powersetsSaved);
    } catch (error) {
        console.error(texts[currentLanguage].errorSaving, error);
        alert(`${texts[currentLanguage].errorSaving} ${error.message}`);
    }
}

/**
 * Загружает выбранные Power Sets для текущего персонажа из Firebase.
 * @returns {Promise<Object>} Promise, который разрешается объектом выбранных заклинаний.
 */
async function loadCharacterPowerSets() {
    if (!currentCharacterId) {
        console.warn("Character ID not set. Cannot load Power Sets.");
        return {};
    }
    try {
        const snapshot = await database.ref('characters/' + currentCharacterId + '/powersets').once('value');
        return snapshot.val() || {};
    } catch (error) {
        console.error(texts[currentLanguage].errorLoadingCharacterPowersets, error);
        return {};
    }
}

/**
 * Загружает все Power Sets из `powersets.json` и сохраняет их в Firebase, если база данных пуста.
 * @returns {Promise<Array>} Promise, который разрешается массивом всех заклинаний.
 */
async function loadAndSyncAllPowerSets() {
    try {
        // Попытка загрузить из Firebase сначала
        const snapshot = await database.ref('powersets').once('value');
        const firebasePowerSets = snapshot.val();

        if (firebasePowerSets) {
            console.log("Loaded Power Sets from Firebase.");
            // Преобразуем объект в массив, если он объект
            return Object.values(firebasePowerSets);
        } else {
            // Если в Firebase пусто, загружаем из JSON
            console.log("No Power Sets in Firebase. Loading from powersets.json...");
            const response = await fetch('data/powersets.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Сохраняем в Firebase
            await database.ref('powersets').set(data);
            console.log("Power Sets synced to Firebase from JSON.");
            return data;
        }
    } catch (error) {
        console.error(texts[currentLanguage].errorLoading, error);
        // Если что-то пошло не так, попробуйте загрузить только из JSON
        try {
            const response = await fetch('data/powersets.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.warn("Falling back to loading from powersets.json due to Firebase error.");
            return data;
        } catch (jsonError) {
            console.error(texts[currentLanguage].errorFetchingJson, jsonError);
            alert(`${texts[currentLanguage].errorFetchingJson} ${jsonError.message}`);
            return [];
        }
    }
}

// --- Функции UI и фильтрации ---

function populateDropdowns() {
    const powerSetDropdown = document.getElementById('filter-power-set');
    const typeDropdown = document.getElementById('filter-type');

    // Очистить текущие опции
    powerSetDropdown.innerHTML = `<option value="">${texts[currentLanguage].filterPowerSetDefault}</option>`;
    typeDropdown.innerHTML = `<option value="">${texts[currentLanguage].filterTypeDefault}</option>`;

    const powerSets = new Set();
    const types = new Set();

    allSpells.forEach(spell => {
        if (spell["Power Set"] && spell["Power Set"][currentLanguage]) {
            powerSets.add(spell["Power Set"][currentLanguage]);
        }
        if (spell.Type && spell.Type[currentLanguage]) {
            types.add(spell.Type[currentLanguage]);
        }
    });

    Array.from(powerSets).sort().forEach(ps => {
        const option = document.createElement('option');
        option.value = ps;
        option.textContent = ps;
        powerSetDropdown.appendChild(option);
    });

    Array.from(types).sort().forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeDropdown.appendChild(option);
    });

    // После заполнения, обновим дерево Power Set Tree
    updateFilterPowerSetTree();
}

function updateFilterPowerSetTree() {
    const selectedPowerSet = document.getElementById('filter-power-set').value;
    const powerSetTreeDropdown = document.getElementById('filter-power-set-tree');
    
    powerSetTreeDropdown.innerHTML = `<option value="">${texts[currentLanguage].filterPowerSetTreeDefault}</option>`;

    if (selectedPowerSet) {
        const powerSetTrees = new Set();
        allSpells.forEach(spell => {
            if (spell["Power Set"] && spell["Power Set"][currentLanguage] === selectedPowerSet && spell["Power Set Tree"] && spell["Power Set Tree"][currentLanguage]) {
                powerSetTrees.add(spell["Power Set Tree"][currentLanguage]);
            }
        });
        Array.from(powerSetTrees).sort().forEach(pst => {
            const option = document.createElement('option');
            option.value = pst;
            option.textContent = pst;
            powerSetTreeDropdown.appendChild(option);
        });
    }
    updateSpellList();
}


function updateSpellList() {
    const filterName = document.getElementById('filter-name').value.toLowerCase();
    const filterPowerSet = document.getElementById('filter-power-set').value;
    const filterPowerSetTree = document.getElementById('filter-power-set-tree').value;
    const filterType = document.getElementById('filter-type').value;
    const spellListDiv = document.getElementById('spell-list');
    spellListDiv.innerHTML = '';

    const filteredSpells = allSpells.filter(spell => {
        const nameMatch = !filterName || (spell.Name && spell.Name[currentLanguage] && spell.Name[currentLanguage].toLowerCase().includes(filterName));
        const powerSetMatch = !filterPowerSet || (spell["Power Set"] && spell["Power Set"][currentLanguage] === filterPowerSet);
        const powerSetTreeMatch = !filterPowerSetTree || (spell["Power Set Tree"] && spell["Power Set Tree"][currentLanguage] === filterPowerSetTree);
        const typeMatch = !filterType || (spell.Type && spell.Type[currentLanguage] === filterType);
        
        return nameMatch && powerSetMatch && powerSetTreeMatch && typeMatch;
    });

    filteredSpells.forEach(spell => {
        const spellCard = document.createElement('div');
        spellCard.className = 'spell-card';
        spellCard.innerHTML = `
            <h3>${spell.Name[currentLanguage] || 'N/A'}</h3>
            <p><strong>${texts[currentLanguage].filterPowerSetDefault.replace('All ', '')}:</strong> ${spell["Power Set"][currentLanguage] || 'N/A'}</p>
            <p><strong>${texts[currentLanguage].filterPowerSetTreeDefault.replace('All ', '')}:</strong> ${spell["Power Set Tree"][currentLanguage] || 'N/A'}</p>
            <p><strong>${texts[currentLanguage].filterTypeDefault.replace('All ', '')}:</strong> ${spell.Type[currentLanguage] || 'N/A'}</p>
            <p>${spell.Description[currentLanguage] || 'N/A'}</p>
            <button class="add-spell-button" data-spell-id="${spell.ID}">${texts[currentLanguage].addSpell}</button>
        `;
        spellListDiv.appendChild(spellCard);
    });

    attachAddSpellListeners();
    updateAutocomplete();
}

function updateAutocomplete() {
    const filterNameInput = document.getElementById('filter-name');
    const autocompleteList = document.getElementById('autocomplete-list');
    const searchTerm = filterNameInput.value.toLowerCase();
    autocompleteList.innerHTML = '';

    if (searchTerm.length === 0) {
        autocompleteList.style.display = 'none';
        return;
    }

    const suggestions = allSpells
        .filter(spell => spell.Name && spell.Name[currentLanguage] && spell.Name[currentLanguage].toLowerCase().includes(searchTerm))
        .map(spell => spell.Name[currentLanguage]);

    const uniqueSuggestions = [...new Set(suggestions)]; // Ensure unique suggestions

    uniqueSuggestions.slice(0, 10).forEach(suggestion => { // Limit to 10 suggestions
        const div = document.createElement('div');
        div.textContent = suggestion;
        div.addEventListener('click', () => {
            filterNameInput.value = suggestion;
            autocompleteList.style.display = 'none';
            updateSpellList();
        });
        autocompleteList.appendChild(div);
    });

    autocompleteList.style.display = uniqueSuggestions.length > 0 ? 'block' : 'none';
}


function attachAddSpellListeners() {
    document.querySelectorAll('.add-spell-button').forEach(button => {
        button.onclick = (event) => {
            const spellId = event.target.dataset.spellId;
            const spellToAdd = allSpells.find(s => s.ID === spellId);
            if (spellToAdd) {
                currentManagedSpells[spellId] = spellToAdd;
                showManagedList();
                alert(texts[currentLanguage].spellAdded);
            } else {
                alert(texts[currentLanguage].noSpellSelected);
            }
        };
    });
}

function showManagedList() {
    const managedSpellListDiv = document.getElementById('managed-spell-list');
    managedSpellListDiv.innerHTML = '';

    const spellsArray = Object.values(currentManagedSpells);

    if (spellsArray.length === 0) {
        managedSpellListDiv.textContent = "No Power Sets added yet."; // Можно локализовать
        return;
    }

    spellsArray.forEach(spell => {
        const spellCard = document.createElement('div');
        spellCard.className = 'spell-card managed-spell-card';
        spellCard.innerHTML = `
            <h3>${spell.Name[currentLanguage] || 'N/A'}</h3>
            <p><strong>${texts[currentLanguage].filterPowerSetDefault.replace('All ', '')}:</strong> ${spell["Power Set"][currentLanguage] || 'N/A'}</p>
            <p><strong>${texts[currentLanguage].filterPowerSetTreeDefault.replace('All ', '')}:</strong> ${spell["Power Set Tree"][currentLanguage] || 'N/A'}</p>
            <p><strong>${texts[currentLanguage].filterTypeDefault.replace('All ', '')}:</strong> ${spell.Type[currentLanguage] || 'N/A'}</p>
            <p>${spell.Description[currentLanguage] || 'N/A'}</p>
            <button class="remove-spell-button" data-spell-id="${spell.ID}">${texts[currentLanguage].removeSpell}</button>
        `;
        managedSpellListDiv.appendChild(spellCard);
    });

    attachRemoveSpellListeners();
}

function attachRemoveSpellListeners() {
    document.querySelectorAll('.remove-spell-button').forEach(button => {
        button.onclick = (event) => {
            const spellId = event.target.dataset.spellId;
            if (currentManagedSpells[spellId]) {
                delete currentManagedSpells[spellId];
                showManagedList();
                alert(texts[currentLanguage].spellRemoved);
            }
        };
    });
}

function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        tabContent.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');

    // Update active tab in navigation
    document.querySelectorAll('.tab-container .tab').forEach(tab => {
        if (tab.getAttribute('href').includes('powersets.html')) {
            tab.classList.add('active'); // Keep powersets tab active in main nav
        } else {
            tab.classList.remove('active');
        }
    });

    // Store active tab in local storage
    localStorage.setItem('activeTab', tabId);

    // If "managed-spells" tab is active, refresh its list
    if (tabId === 'managed-spells') {
        showManagedList();
    }
}


// --- Инициализация при загрузке DOM ---
document.addEventListener('DOMContentLoaded', async () => {
    applyTexts(); // Применяем тексты сразу

    // Загрузка всех Power Sets (из Firebase или JSON)
    allSpells = await loadAndSyncAllPowerSets();

    // Загрузка выбранных Power Sets для персонажа
    currentManagedSpells = await loadCharacterPowerSets();

    populateDropdowns(); // Заполняем выпадающие списки данными
    showTab(localStorage.getItem('activeTab') || 'spell-creator'); // Показать вкладку по умолчанию или из localStorage
    showManagedList(); // Инициализация отображения списка выбранных

    // Обработчики событий для фильтров
    document.getElementById('filter-name').addEventListener('input', updateSpellList);
    document.getElementById('filter-name').addEventListener('blur', () => {
        setTimeout(() => {
            document.getElementById('autocomplete-list').style.display = 'none';
        }, 200);
    });
    document.getElementById('filter-name').addEventListener('focus', () => {
        if (document.getElementById('filter-name').value.length > 0) {
            updateAutocomplete();
        }
    });

    document.getElementById('filter-power-set').addEventListener('change', updateFilterPowerSetTree);
    document.getElementById('filter-power-set-tree').addEventListener('change', updateSpellList);
    document.getElementById('filter-type').addEventListener('change', updateSpellList);

    // Обработчик кнопки "Add to Character"
    document.getElementById('add-to-character-button').addEventListener('click', () => {
        const selectedSpellId = document.querySelector('.spell-card.selected')?.dataset.spellId; // Предполагается, что есть механизм выбора
        if (selectedSpellId) {
            const spellToAdd = allSpells.find(s => s.ID === selectedSpellId);
            if (spellToAdd) {
                currentManagedSpells[selectedSpellId] = spellToAdd;
                showManagedList();
                alert(texts[currentLanguage].spellAdded);
            }
        } else {
            alert(texts[currentLanguage].noSpellSelected);
        }
    });

    // Обработчик кнопки "Save Character's Power Sets"
    document.getElementById('save-character-powersets').addEventListener('click', () => {
        saveCharacterPowerSets(currentManagedSpells);
    });

    // Инициализация отображения списка заклинаний
    updateSpellList();
});