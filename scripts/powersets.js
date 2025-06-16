const database = window.database;
const SPELLS_DB_PATH = 'spells';

//@param{Object} spellData
//@param {string} [spellId]
//@returns {Promise<string>}

async function saveSpellToFirebase(spellData, spellId = null) {
    try {
        const spellsRef =database.ref(SPELLS_DB_PATH);
        let spellRef;

        if (spellId) {
            spellRef = spellsRef.child(spellId);
            await spellRef.update(spellData);
            console.log(texts[currentLanguage].powersetsSaved);
            return spellId;
        } else {
            spellRef =spellsRef.push();
            await spellRef.set(spellData);
            console.log(texts[currentLanguage].spellAdded);
            return spellRef.key;
        }
    } catch (error) {
        console.error(text[currentLanguage].errorSaving, error);
        throw error;
    }
}

//@returns {Promise<Array>}

async function loadAllSpellsFromFirebase() {
  try {
    const snapshot = await database.ref(SPELLS_DB_PATH).once('value');
    return snapshot.val() || [];
  } catch (error) {
    console.error("Ошибка загрузки из Firebase:", error);
    return [];
  }
}


//@param {string} spellId
//@returns {Promise<void>}

async function deleteSpellFromFirebase(spellId){
    try {
        await database.ref('${SPELLS_DB_PATH}/${spellId}}').remove();
        console.log (texts[currentLanguage].spellRemoved);
    } catch (error) {
        console.error(texts[currentLanguage].errorSaving, error);
        throw error;
    }
}

let allSpells = []; // Все заклинания из JSON
let currentCharacterId = 'testCharacter1'; // TODO: Замените на реальный ID персонажа (например, из localStorage или URL)
let currentManagedSpells = {}; // Объект для управления выбранными заклинаниями
// let currentLanguage = localStorage.getItem('language') || 'en'; // Язык по умолчанию

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
    const elements = {
        'title': texts[currentLanguage].title,
        'powersets-title': texts[currentLanguage].powersetsTitle,
        'managed-spells-title': texts[currentLanguage].managedSpellsTitle,
        'add-to-character-button': texts[currentLanguage].addToCharacterButton,
        'save-character-powersets': texts[currentLanguage].saveCharacterPowersetsButton
    };

    for (const [id, text] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    const filterName = document.getElementById('filter-name');
    if (filterName) {
        filterName.placeholder = texts[currentLanguage].filterNamePlaceholder;
    }

    // Update dropdown default texts if they exist
    const updateDropdownText = (id, text) => {
        const dropdown = document.getElementById(id);
        if (dropdown && dropdown.options[0]) {
            dropdown.options[0].textContent = text;
        }
    };

    updateDropdownText('filter-power-set', texts[currentLanguage].filterPowerSetDefault);
    updateDropdownText('filter-power-set-tree', texts[currentLanguage].filterPowerSetTreeDefault);
    updateDropdownText('filter-type', texts[currentLanguage].filterTypeDefault);
}


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
    // Сначала пробуем загрузить из Firebase
    const snapshot = await database.ref('powersets').once('value');
    const firebasePowerSets = snapshot.val();

    if (firebasePowerSets) {
      console.log("Данные загружены из Firebase");
      return Object.values(firebasePowerSets);
    }

    // Если в Firebase нет данных, пробуем загрузить из JSON
    console.log("Загрузка из powersets.json...");
    const response = await fetch('data/powersets.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Сохраняем в Firebase для будущих использований
    await database.ref('powersets').set(data);
    return data;
    
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return []; // Возвращаем пустой массив при ошибке
  }
}
// --- Функции UI и фильтрации ---

function populateDropdowns() {
  try {
    // 1. Получаем элементы с проверкой их существования
    const powerSetDropdown = document.getElementById('filter-power-set');
    const typeDropdown = document.getElementById('filter-type');
    const spellTypeContainer = document.getElementById('spell-type-container');
    const powerSetContainer = document.getElementById('power-set-container');
    const powerSetTreeContainer = document.getElementById('power-set-tree-container');

    // Проверяем существование всех необходимых элементов
    if (!powerSetDropdown || !typeDropdown || !spellTypeContainer || 
        !powerSetContainer || !powerSetTreeContainer) {
      throw new Error('Один или несколько необходимых DOM-элементов не найдены');
    }

    // 2. Очищаем dropdowns
    powerSetDropdown.innerHTML = '';
    typeDropdown.innerHTML = '';

    // 3. Добавляем дефолтные опции
    const addDefaultOption = (select, text) => {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = text;
      select.appendChild(option);
    };

    addDefaultOption(powerSetDropdown, texts[currentLanguage].filterPowerSetDefault);
    addDefaultOption(typeDropdown, texts[currentLanguage].filterTypeDefault);

    // 4. Собираем уникальные значения для dropdowns
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

    // 5. Заполняем dropdown для Power Sets
    Array.from(powerSets).sort().forEach(ps => {
      const option = document.createElement('option');
      option.value = ps;
      option.textContent = ps;
      powerSetDropdown.appendChild(option);
    });

    // 6. Заполняем dropdown для Types
    Array.from(types).sort().forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      typeDropdown.appendChild(option);
    });

    // 7. Заполняем контейнеры для формы создания
    fillDynamicContainer(spellTypeContainer, 'type', lists.type || []);
    fillDynamicContainer(powerSetContainer, 'power-set', Object.keys(lists.powerSets || {}));
    
    // Получаем первый power set для заполнения power set tree
    const firstPowerSet = Object.keys(lists.powerSets || {})[0] || '';
    const powerSetTreeList = lists.powerSets?.[firstPowerSet] || [];
    fillDynamicContainer(powerSetTreeContainer, 'power-set-tree', powerSetTreeList);

    // 8. Обновляем зависимые dropdowns
    updateFilterPowerSetTree();

  } catch (error) {
    console.error('Ошибка в populateDropdowns:', error);
    // Можно добавить отображение ошибки пользователю
    if (typeof showError === 'function') {
      showError(texts[currentLanguage].errorLoading);
    }
  }
}

function fillDynamicContainer(container, fieldName, options) {
  if (!container) return;
  
  container.innerHTML = '';
  
  const div = document.createElement('div');
  div.className = 'dynamic-input-group';
  
  const select = document.createElement('select');
  select.id = `${fieldName}-0`;
  
  // Добавляем дефолтную опцию
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select --';
  select.appendChild(defaultOption);
  
  // Добавляем остальные опции
  options.forEach(option => {
    const optElement = document.createElement('option');
    optElement.value = option;
    optElement.textContent = option;
    select.appendChild(optElement);
  });
  
  // Добавляем кнопку добавления
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.textContent = '+';
  addButton.onclick = () => addDynamicInput(container, fieldName);
  
  div.appendChild(select);
  div.appendChild(addButton);
  container.appendChild(div);
}

function addDynamicInput(container, fieldName) {
    try {
        // 1. Проверяем входные параметры
        if (!container || !fieldName) {
            throw new Error('Не указан контейнер или имя поля');
        }

        // 2. Определяем текущий индекс (количество существующих инпутов + 1)
        const currentIndex = container.querySelectorAll('.dynamic-input-group').length;
        const newId = `${fieldName}-${currentIndex}`;

        // 3. Создаем новую группу элементов
        const groupDiv = document.createElement('div');
        groupDiv.className = 'dynamic-input-group';

        // 4. Создаем элемент ввода (select или input)
        let inputElement;
        const isSelectField = [
            'spell-type', 'power-set', 'power-set-tree', 
            'action', 'target', 'range', 'duration',
            'cooldown', 'cost', 'defense', 'attack'
        ].includes(fieldName);

        if (isSelectField) {
            inputElement = document.createElement('select');
            inputElement.id = newId;

            // Добавляем дефолтную пустую опцию
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select --';
            inputElement.appendChild(defaultOption);

            // Заполняем опции в зависимости от типа поля
            let options = [];
            if (fieldName === 'power-set') {
                options = Object.keys(lists.powerSets || {});
            } else if (fieldName === 'power-set-tree') {
                // Получаем выбранный power-set для определения доступных деревьев
                const powerSetSelect = container.previousElementSibling?.querySelector('select');
                const selectedPowerSet = powerSetSelect?.value || Object.keys(lists.powerSets || {})[0] || '';
                options = lists.powerSets?.[selectedPowerSet] || [];
            } else {
                options = lists[fieldName] || [];
            }

            // Добавляем опции
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                inputElement.appendChild(optionElement);
            });

            // Особый обработчик для power-set
            if (fieldName === 'power-set') {
                inputElement.addEventListener('change', function() {
                    // Находим соответствующий контейнер power-set-tree
                    const treeContainer = container.closest('.tab-content')
                        .querySelector('#power-set-tree-container');
                    
                    if (treeContainer) {
                        const selectedPowerSet = this.value;
                        const treeOptions = lists.powerSets?.[selectedPowerSet] || [];
                        
                        // Очищаем и перезаполняем контейнер
                        treeContainer.innerHTML = '';
                        fillDynamicContainer(treeContainer, 'power-set-tree', treeOptions);
                    }
                });
            }
        } else {
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.id = newId;
            inputElement.placeholder = texts[currentLanguage][`placeholder_${fieldName}`] || '';
        }

        // 5. Создаем кнопку удаления
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.textContent = '-';
        removeButton.className = 'remove-btn';
        removeButton.onclick = function() {
            // Анимация удаления
            groupDiv.style.transform = 'translateX(-100%)';
            groupDiv.style.opacity = '0';
            
            setTimeout(() => {
                container.removeChild(groupDiv);
                
                // Обновляем индексы оставшихся элементов
                const remainingGroups = container.querySelectorAll('.dynamic-input-group');
                remainingGroups.forEach((group, index) => {
                    const input = group.querySelector('select, input');
                    if (input) {
                        input.id = `${fieldName}-${index}`;
                    }
                });
                
                // Если удалили последний элемент, делаем кнопку добавления у предыдущего
                if (remainingGroups.length > 0) {
                    const lastGroup = remainingGroups[remainingGroups.length - 1];
                    const lastButton = lastGroup.querySelector('button');
                    if (lastButton) {
                        lastButton.textContent = '+';
                        lastButton.onclick = function() {
                            addDynamicInput(container, fieldName);
                        };
                        lastButton.className = 'add-btn';
                    }
                }
            }, 300);
        };

        // 6. Собираем группу
        groupDiv.appendChild(inputElement);
        groupDiv.appendChild(removeButton);

        // 7. Модифицируем предыдущую кнопку (меняем "+" на "-")
        const prevGroups = container.querySelectorAll('.dynamic-input-group');
        if (prevGroups.length > 0) {
            const lastGroup = prevGroups[prevGroups.length - 1];
            const prevButton = lastGroup.querySelector('button');
            if (prevButton) {
                prevButton.textContent = '-';
                prevButton.onclick = function() {
                    container.removeChild(lastGroup);
                    
                    // Обновляем индексы
                    const remainingGroups = container.querySelectorAll('.dynamic-input-group');
                    remainingGroups.forEach((group, index) => {
                        const input = group.querySelector('select, input');
                        if (input) {
                            input.id = `${fieldName}-${index}`;
                        }
                    });
                };
                prevButton.className = 'remove-btn';
            }
        }

        // 8. Добавляем новую группу в контейнер
        container.appendChild(groupDiv);

        // 9. Прокручиваем к новому элементу
        groupDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        console.error(`Ошибка при добавлении динамического поля ${fieldName}:`, error);
        // Можно добавить уведомление для пользователя
        if (typeof showError === 'function') {
            showError(texts[currentLanguage].errorAddingField);
        }
    }
}



function getElement(id) {
  const el = document.getElementById(id);
  if (!el) console.error(`Элемент ${id} не найден`);
  return el;
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
  const input = getElement('filter-name');
  if (!input) return;

  const autocompleteList = getElement('autocomplete-list');
  if (!autocompleteList) return;

  const value = input.value.toLowerCase();
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
      if (document.getElementById('powersets-title')) {
        applyTexts();
    }

    // Загрузка всех Power Sets (из Firebase или JSON)
    allSpells = await loadAllSpellsFromFirebase();

    if (allSpells.length === 0) {
        try {
            const response = await fetch('powersets.json');
            if (!response.ok) throw new Error ('HTTP error! status: ${response.status}');
            const data = await response.json();

            const spellsRef = database.ref(SPELLS_DB_PATH);
            await spellsRef.set(data);

            allSpells = Object.entries(data).map(([id, spell]) => ({ id, ...spell }));
        } catch (error) {
            console.error(texts[currentLanguage].errorFetchingJson, error);
            alert ('${texts[currentLanguage].errorFetchingJson} ${error.message}');
        }
    }

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
