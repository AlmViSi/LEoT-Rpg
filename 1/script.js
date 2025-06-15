// Language data
const translations = {
    ru: {
        title: "Гримуар: Конструктор заклинаний",
        tab_creator: "Создание заклинаний",
        tab_list: "Список заклинаний",
        tab_manager: "Управление списками",
        creator_title: "Создать заклинание",
        label_spell_name: "Название заклинания",
        tooltip_spell_name: "Введите уникальное название заклинания",
        placeholder_spell_name: "Введите название заклинания",
        label_spell_type: "Тип",
        tooltip_spell_type: "Выберите тип заклинания",
        label_power_set: "Набор сил",
        tooltip_power_set: "Выберите основную категорию заклинания",
        label_power_set_tree: "Подкатегория",
        tooltip_power_set_tree: "Выберите конкретную подкатегорию",
        label_level: "Уровень/Ранг/Требования",
        tooltip_level: "Укажите уровень или требования",
        placeholder_level: "например, 5-й уровень, Ранг 3",
        label_description: "Описание",
        tooltip_description: "Опишите повествовательный эффект заклинания",
        placeholder_description: "Опишите эффект заклинания",
        label_action: "Действие",
        tooltip_action: "Тип действия, необходимого для использования",
        label_target: "Цель",
        tooltip_target: "Кого или что затрагивает заклинание",
        label_range: "Дальность/Радиус",
        tooltip_range: "Дальность или радиус действия заклинания",
        label_duration: "Длительность",
        tooltip_duration: "Как долго длится заклинание",
        label_effect: "Эффект",
        tooltip_effect: "Механический эффект заклинания",
        placeholder_effect: "например, Наносит 4d6 урона огнём",
        label_cooldown: "Перезарядка",
        tooltip_cooldown: "Время до повторного использования заклинания",
        label_cost: "Стоимость",
        tooltip_cost: "Затраты на применение заклинания",
        label_defense: "Защита",
        tooltip_defense: "Защитные атрибуты, влияющие на заклинание",
        label_attack: "Атака",
        tooltip_attack: "Атакующие атрибуты, усиливающие заклинание",
        label_restrictions: "Ограничения/Условия",
        tooltip_restrictions: "Ограничения заклинания",
        placeholder_restrictions: "например, Требуется прямая видимость",
        label_upgrades: "Варианты/Улучшения",
        tooltip_upgrades: "Возможные улучшения или варианты",
        placeholder_upgrades: "например, Радиус увеличивается на 10-м уровне",
        save_spell: "Сохранить заклинание",
        load_spell: "Загрузить последнее заклинание",
        clear_form: "Очистить форму",
        list_title: "Список заклинаний",
        placeholder_filter_name: "Фильтр по названию",
        table_name: "Название",
        table_power_set: "Набор сил",
        table_power_set_tree: "Подкатегория",
        table_type: "Тип",
        table_action: "Действие",
        delete_spell: "Удалить",
        edit_spell: "Редактировать",
        close_modal: "Закрыть",
        modal_title: "Детали заклинания",
        confirm_delete: "Вы уверены, что хотите удалить это заклинание?",
        confirm_delete_title: "Подтверждение удаления",
        confirm: "Подтвердить",
        cancel: "Отмена",
        manager_title: "Управление списками",
        label_manager_list_type: "Выберите список для управления:",
        manager_type: "Список типов",
        placeholder_new_type: "Добавить новый тип",
        add_type: "Добавить",
        manager_power_set: "Список наборов сил",
        placeholder_new_power_set: "Добавить новый набор сил",
        add_power_set: "Добавить",
        manager_power_set_tree: "Список подкатегорий",
        label_power_set_select: "Выберите набор сил",
        placeholder_new_power_set_tree: "Добавить новую подкатегорию",
        add_power_set_tree: "Добавить",
        manager_action: "Список действий",
        placeholder_new_action: "Добавить новое действие",
        add_action: "Добавить",
        manager_target: "Список целей",
        placeholder_new_target: "Добавить новую цель",
        add_target: "Добавить",
        manager_range: "Список дальности/радиуса",
        placeholder_new_range: "Добавить новую дальность/радиус",
        add_range: "Добавить",
        manager_duration: "Список длительностей",
        placeholder_new_duration: "Добавить новую длительность",
        add_duration: "Добавить",
        manager_cooldown: "Список перезарядок",
        placeholder_new_cooldown: "Добавить новую перезарядку",
        add_cooldown: "Добавить",
        manager_cost: "Список стоимостей",
        placeholder_new_cost: "Добавить новую стоимость",
        add_cost: "Добавить",
        manager_defense: "Список защит",
        placeholder_new_defense: "Добавить новую защиту",
        add_defense: "Добавить",
        manager_attack: "Список атак",
        placeholder_new_attack: "Добавить новую атаку",
        add_attack: "Добавить",
        export_data: "Экспорт данных",
        import_data: "Импорт данных",
        remove_button: "-",
        add_button: "+"
    }
};

// Initial dropdown data
const dropdownData = {
    type: ["Combat", "Magical", "Social", "Passive", "Active", "Reaction"],
    powerSets: { "Academic": ["Culture and History", "Law and Politics", "Linguistics", "Mathematics", "Natural Sciences", "Religion and Magic"], "Black Magic": ["Curses", "Dark Rituals", "Death Magic", "Demonology", "Forbidden Knowledge", "Necromancy"], "Blood Magic": ["Blood Bonds", "Blood Control", "Blood Sense", "Blood Transfusion", "Crimson Empowerment", "Power Drain"], "Craft": ["Alchemy and Gastronomy", "Blacksmithing", "Enchantment", "Engineering", "Jewelcrafting", "Tailoring"], "Creation": ["Acting", "Architecture", "Artificing", "Literature", "Music", "Painting"], "Defense": ["Heavy Armor", "Light Armor", "Medium Armor", "Occult Defense", "Shield Mastery", "Unarmored"], "Elemental Control": ["Air", "Earth", "Electricity", "Fire", "Ice", "Light"], "Magic of Gods": ["Divination", "Magic of Godstones", "Portal Magic", "Rune Magic", "Soul Manipulation", "Summoning"], "Martial Arts": ["Axes", "Blunt", "Daggers", "Hand-To-Hand", "Polearms", "Swords"], "Mind Magic": ["Absorb Knowledge", "Illusion", "Mana Control", "Memory Manipulation", "Mental Fortress", "Telepathy"], "Mind Mastery": ["Discipline", "Ego", "Empathy", "Intuition", "Logic", "Will"], "Physical Mastery": ["Agility", "Dexterity", "Endurance", "Resilience", "Speed", "Strength"], "Ranged Weapon": ["Bow", "Crossbow", "Fire-Arm Weapon", "Magic Weapon", "Siege Weapon", "Throwing Weapon"], "Sense": ["Foresight", "Hearing", "Memory", "Sight", "Taste and Smell", "Touch"], "Speech": ["Bluff", "Intimidate", "Leadership", "Psychology", "Seduction", "Trade"], "Survival": ["Cooking", "Gathering", "Hunting", "Local Knowledge", "Making Traps", "Navigation"], "Transport Control": ["Driving", "Ethereal Travel", "Piloting", "Portal Mastery", "Riding", "Sailing"], "White Magic": ["Blessing", "Calling", "Purification", "Restoration", "Transmutation", "Weather Control"] },
    action: ["Standard", "Bonus", "Reaction", "Passive", "Instant"],
    target: ["Single Target", "Area", "Ally", "Enemy", "Self"],
    range: ["30 feet", "15-foot cone", "10 yards", "Instant", "Touch"],
    duration: ["Instantaneous", "1 minute", "1 hour", "Until end of combat", "Permanent"],
    cooldown: ["Once per short rest", "Once per long rest", "1 turn", "None"],
    cost: ["1 spell slot (3rd level)", "75 mana", "2 power points", "5 HP"],
    defense: ["Vigilance", "Dodge", "Magic Resistance", "Endurance", "Influence"],
    attack: ["Intrigue", "Accuracy", "Spell Power", "Physical Strength", "Resolve"]
};

// Load saved data from localStorage
let lists = JSON.parse(localStorage.getItem('dropdownData')) || dropdownData;
let savedSpells = JSON.parse(localStorage.getItem('savedSpells')) || [];
let currentLanguage = 'ru'; // Set language to Russian by default
let tabOrder = JSON.parse(localStorage.getItem('tabOrder')) || ['spell-creator', 'spell-list', 'list-manager'];

// Update interface language
function updateLanguage() {
    const t = translations[currentLanguage];
    document.getElementById('title').textContent = t.title;
    document.getElementById('tab-creator').textContent = t.tab_creator;
    document.getElementById('tab-list').textContent = t.tab_list;
    document.getElementById('tab-manager').textContent = t.tab_manager;
    document.getElementById('creator-title').textContent = t.creator_title;
    document.getElementById('label-spell-name').textContent = t.label_spell_name;
    document.getElementById('label-spell-name').setAttribute('data-tooltip', t.tooltip_spell_name);
    document.getElementById('spell-name').placeholder = t.placeholder_spell_name;
    document.getElementById('label-spell-type').textContent = t.label_spell_type;
    document.getElementById('label-spell-type').setAttribute('data-tooltip', t.tooltip_spell_type);
    document.getElementById('label-power-set').textContent = t.label_power_set;
    document.getElementById('label-power-set').setAttribute('data-tooltip', t.tooltip_power_set);
    document.getElementById('label-power-set-tree').textContent = t.label_power_set_tree;
    document.getElementById('label-power-set-tree').setAttribute('data-tooltip', t.tooltip_power_set_tree);
    document.getElementById('label-level').textContent = t.label_level;
    document.getElementById('label-level').setAttribute('data-tooltip', t.tooltip_level);
    document.getElementById('label-description').textContent = t.label_description;
    document.getElementById('label-description').setAttribute('data-tooltip', t.tooltip_description);
    document.getElementById('description').placeholder = t.placeholder_description;
    document.getElementById('label-action').textContent = t.label_action;
    document.getElementById('label-action').setAttribute('data-tooltip', t.tooltip_action);
    document.getElementById('label-target').textContent = t.label_target;
    document.getElementById('label-target').setAttribute('data-tooltip', t.tooltip_target);
    document.getElementById('label-range').textContent = t.label_range;
    document.getElementById('label-range').setAttribute('data-tooltip', t.tooltip_range);
    document.getElementById('label-duration').textContent = t.label_duration;
    document.getElementById('label-duration').setAttribute('data-tooltip', t.tooltip_duration);
    document.getElementById('label-effect').textContent = t.label_effect;
    document.getElementById('label-effect').setAttribute('data-tooltip', t.tooltip_effect);
    document.getElementById('effect').placeholder = t.placeholder_effect;
    document.getElementById('label-cooldown').textContent = t.label_cooldown;
    document.getElementById('label-cooldown').setAttribute('data-tooltip', t.tooltip_cooldown);
    document.getElementById('label-cost').textContent = t.label_cost;
    document.getElementById('label-cost').setAttribute('data-tooltip', t.tooltip_cost);
    document.getElementById('label-defense').textContent = t.label_defense;
    document.getElementById('label-defense').setAttribute('data-tooltip', t.tooltip_defense);
    document.getElementById('label-attack').textContent = t.label_attack;
    document.getElementById('label-attack').setAttribute('data-tooltip', t.tooltip_attack);
    document.getElementById('label-restrictions').textContent = t.label_restrictions;
    document.getElementById('label-restrictions').setAttribute('data-tooltip', t.tooltip_restrictions);
    document.getElementById('label-upgrades').textContent = t.label_upgrades;
    document.getElementById('label-upgrades').setAttribute('data-tooltip', t.tooltip_upgrades);
    // Set button texts
    document.getElementById('save-spell').textContent = t.save_spell;
    document.getElementById('load-spell').textContent = t.load_spell;
    document.getElementById('clear-form').textContent = t.clear_form;
    document.getElementById('list-title').textContent = t.list_title;
    document.getElementById('filter-name').placeholder = t.placeholder_filter_name;
    document.getElementById('table-name').textContent = t.table_name;
    document.getElementById('table-power-set').textContent = t.table_power_set;
    document.getElementById('table-power-set-tree').textContent = t.table_power_set_tree;
    document.getElementById('table-type').textContent = t.table_type;
    document.getElementById('table-action').textContent = t.table_action;
    document.getElementById('manager-title').textContent = t.manager_title;
    document.getElementById('label-manager-list-type').textContent = t.label_manager_list_type;
    document.getElementById('manager-type').textContent = t.manager_type;
    document.getElementById('new-type').placeholder = t.placeholder_new_type;
    document.getElementById('add-type').textContent = t.add_type;
    document.getElementById('manager-power-set').textContent = t.manager_power_set;
    document.getElementById('new-power-set').placeholder = t.placeholder_new_power_set;
    document.getElementById('add-power-set').textContent = t.add_power_set;
    document.getElementById('manager-power-set-tree').textContent = t.manager_power_set_tree;
    document.getElementById('label-power-set-select').textContent = t.label_power_set_select;
    document.getElementById('new-power-set-tree').placeholder = t.placeholder_new_power_set_tree;
    document.getElementById('add-power-set-tree').textContent = t.add_power_set_tree;
    document.getElementById('manager-action').textContent = t.manager_action;
    document.getElementById('new-action').placeholder = t.placeholder_new_action;
    document.getElementById('add-action').textContent = t.add_action;
    document.getElementById('manager-target').textContent = t.manager_target;
    document.getElementById('new-target').placeholder = t.placeholder_new_target;
    document.getElementById('add-target').textContent = t.add_target;
    document.getElementById('manager-range').textContent = t.manager_range;
    document.getElementById('new-range').placeholder = t.placeholder_new_range;
    document.getElementById('add-range').textContent = t.add_range;
    document.getElementById('manager-duration').textContent = t.manager_duration;
    document.getElementById('new-duration').placeholder = t.placeholder_new_duration;
    document.getElementById('add-duration').textContent = t.add_duration;
    document.getElementById('manager-cooldown').textContent = t.manager_cooldown;
    document.getElementById('new-cooldown').placeholder = t.placeholder_new_cooldown;
    document.getElementById('add-cooldown').textContent = t.add_cooldown;
    document.getElementById('manager-cost').textContent = t.manager_cost;
    document.getElementById('new-cost').placeholder = t.placeholder_new_cost;
    document.getElementById('add-cost').textContent = t.add_cost;
    document.getElementById('manager-defense').textContent = t.manager_defense;
    document.getElementById('new-defense').placeholder = t.placeholder_new_defense;
    document.getElementById('add-defense').textContent = t.add_defense;
    document.getElementById('manager-attack').textContent = t.manager_attack;
    document.getElementById('new-attack').placeholder = t.placeholder_new_attack;
    document.getElementById('add-attack').textContent = t.add_attack;
    document.getElementById('export-data').textContent = t.export_data;
    document.getElementById('import-data').textContent = t.import_data;
}

// Function to dynamically add input fields for attributes like Level, Restrictions, Upgrades
function addDynamicInputField(containerId, placeholderText, listType, initialValue = '', index = -1) {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.classList.add('dynamic-input-group');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholderText;
    input.value = initialValue;
    input.id = `${containerId.replace('-container', '')}-${index === -1 ? container.children.length : index}`;
    input.oninput = (event) => {
        if (listType === 'level') updateTooltipContent(event.target, translations[currentLanguage].tooltip_level);
        if (listType === 'restrictions') updateTooltipContent(event.target, translations[currentLanguage].tooltip_restrictions);
        if (listType === 'upgrades') updateTooltipContent(event.target, translations[currentLanguage].tooltip_upgrades);
    };

    const addButton = document.createElement('button');
    addButton.textContent = translations[currentLanguage].add_button;
    addButton.onclick = () => addDynamicInputField(containerId, placeholderText, listType);

    const removeButton = document.createElement('button');
    removeButton.textContent = translations[currentLanguage].remove_button;
    removeButton.onclick = () => {
        div.classList.add('removing');
        div.addEventListener('animationend', () => div.remove());
    };

    div.appendChild(input);
    div.appendChild(addButton);
    div.appendChild(removeButton);
    container.appendChild(div);

    // If it's the first input and there's a specific placeholder for it
    if (index === 0 && placeholderText) {
        input.placeholder = placeholderText;
    }
}

// Function to clear and populate dynamic input fields (Level, Restrictions, Upgrades)
function clearAndPopulateDynamicInputs(idPrefix, containerId, placeholderKey, values) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing inputs
    const placeholderText = translations[currentLanguage][placeholderKey];
    if (values && values.length > 0) {
        values.forEach((value, index) => addDynamicInputField(containerId, placeholderText, idPrefix, value, index));
    } else {
        addDynamicInputField(containerId, placeholderText, idPrefix);
    }
}

// Populate dropdowns with data
function populateDropdowns() {
    populateSelect('spell-type-container', lists.type, 'type');
    populatePowerSetDropdowns();
    populateSelect('action-container', lists.action, 'action');
    populateSelect('target-container', lists.target, 'target');
    populateSelect('range-container', lists.range, 'range');
    populateSelect('duration-container', lists.duration, 'duration');
    populateSelect('cooldown-container', lists.cooldown, 'cooldown');
    populateSelect('cost-container', lists.cost, 'cost');
    populateSelect('defense-container', lists.defense, 'defense');
    populateSelect('attack-container', lists.attack, 'attack');
}

// Generic function to populate a select dropdown or dynamic input group
function populateSelect(containerId, options, listType, selectedValue = '') {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    if (Array.isArray(options)) { // For simple dropdowns (Type, Action, etc.)
        const select = document.createElement('select');
        select.id = containerId.replace('-container', '');
        select.onchange = () => updateSpellList();

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = `-- ${translations[currentLanguage].label_spell_type || 'Select'} --`;
        select.appendChild(defaultOption);

        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            if (option === selectedValue) {
                opt.selected = true;
            }
            select.appendChild(opt);
        });
        container.appendChild(select);
    } else { // For powerSets which have a tree structure
        // This case is handled by populatePowerSetDropdowns
    }
}


function populatePowerSetDropdowns(selectedPowerSet = '', selectedPowerSetTree = '') {
    const powerSetContainer = document.getElementById('power-set-container');
    powerSetContainer.innerHTML = '';
    const powerSetSelect = document.createElement('select');
    powerSetSelect.id = 'power-set';
    powerSetSelect.onchange = () => {
        populatePowerSetTreeDropdown(powerSetSelect.value);
        updateSpellList();
    };

    let defaultPowerSetOption = document.createElement('option');
    defaultPowerSetOption.value = "";
    defaultPowerSetOption.textContent = `-- ${translations[currentLanguage].label_power_set || 'Select Power Set'} --`;
    powerSetSelect.appendChild(defaultPowerSetOption);

    Object.keys(lists.powerSets).sort().forEach(powerSet => {
        const option = document.createElement('option');
        option.value = powerSet;
        option.textContent = powerSet;
        if (powerSet === selectedPowerSet) {
            option.selected = true;
        }
        powerSetSelect.appendChild(option);
    });
    powerSetContainer.appendChild(powerSetSelect);

    populatePowerSetTreeDropdown(selectedPowerSet || powerSetSelect.value, selectedPowerSetTree);
}

function populatePowerSetTreeDropdown(powerSet, selectedPowerSetTree = '') {
    const powerSetTreeContainer = document.getElementById('power-set-tree-container');
    powerSetTreeContainer.innerHTML = '';
    const powerSetTreeSelect = document.createElement('select');
    powerSetTreeSelect.id = 'power-set-tree';
    powerSetTreeSelect.onchange = () => updateSpellList();

    let defaultPowerSetTreeOption = document.createElement('option');
    defaultPowerSetTreeOption.value = "";
    defaultPowerSetTreeOption.textContent = `-- ${translations[currentLanguage].label_power_set_tree || 'Select Subcategory'} --`;
    powerSetTreeSelect.appendChild(defaultPowerSetTreeOption);

    if (powerSet && lists.powerSets[powerSet]) {
        lists.powerSets[powerSet].sort().forEach(tree => {
            const option = document.createElement('option');
            option.value = tree;
            option.textContent = tree;
            if (tree === selectedPowerSetTree) {
                option.selected = true;
            }
            powerSetTreeSelect.appendChild(option);
        });
    }
    powerSetTreeContainer.appendChild(powerSetTreeSelect);
}


// Tab management
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        tabContent.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
    localStorage.setItem('activeTab', tabId);

    // Special handling for list manager tab
    if (tabId === 'list-manager') {
        showManagedList();
    }
    // Update spell list when switching to spell-list tab
    if (tabId === 'spell-list') {
        updateSpellList();
    }
}

// Spell creation and management
function saveSpell() {
    const spellName = document.getElementById('spell-name').value;
    if (!spellName) {
        alert('Spell Name is required!');
        return;
    }

    const newSpell = {
        name: spellName,
        type: document.getElementById('type')?.value || '',
        powerSet: document.getElementById('power-set')?.value || '',
        powerSetTree: document.getElementById('power-set-tree')?.value || '',
        level: Array.from(document.querySelectorAll('#level-container input')).map(input => input.value).filter(value => value),
        description: document.getElementById('description').value,
        action: document.getElementById('action')?.value || '',
        target: Array.from(document.querySelectorAll('#target-container select')).map(select => select.value).filter(value => value),
        range: Array.from(document.querySelectorAll('#range-container select')).map(select => select.value).filter(value => value),
        duration: Array.from(document.querySelectorAll('#duration-container select')).map(select => select.value).filter(value => value),
        effect: document.getElementById('effect').value,
        cooldown: Array.from(document.querySelectorAll('#cooldown-container select')).map(select => select.value).filter(value => value),
        cost: Array.from(document.querySelectorAll('#cost-container select')).map(select => select.value).filter(value => value),
        defense: Array.from(document.querySelectorAll('#defense-container select')).map(select => select.value).filter(value => value),
        attack: Array.from(document.querySelectorAll('#attack-container select')).map(select => select.value).filter(value => value),
        restrictions: Array.from(document.querySelectorAll('#restrictions-container input')).map(input => input.value).filter(value => value),
        upgrades: Array.from(document.querySelectorAll('#upgrades-container input')).map(input => input.value).filter(value => value)
    };

    const existingIndex = savedSpells.findIndex(s => s.name === newSpell.name);
    if (existingIndex !== -1) {
        savedSpells[existingIndex] = newSpell;
    } else {
        savedSpells.push(newSpell);
    }
    localStorage.setItem('savedSpells', JSON.stringify(savedSpells));
    alert('Spell saved!');
    updateSpellList(); // Update the list after saving
}

function loadSpell(spellName = null) {
    let spellToLoad = null;
    if (spellName) {
        spellToLoad = savedSpells.find(s => s.name === spellName);
    } else {
        // If no name is provided, load the last saved spell (or the first if only one)
        if (savedSpells.length > 0) {
            spellToLoad = savedSpells[savedSpells.length - 1];
        }
    }

    if (spellToLoad) {
        document.getElementById('spell-name').value = spellToLoad.name || '';
        populateSelect('spell-type-container', lists.type, 'type', spellToLoad.type);
        populatePowerSetDropdowns(spellToLoad.powerSet, spellToLoad.powerSetTree);
        clearAndPopulateDynamicInputs('level', 'level-container', 'placeholder_level', spellToLoad.level);
        document.getElementById('description').value = spellToLoad.description || '';
        populateSelect('action-container', lists.action, 'action', spellToLoad.action);
        populateSelect('target-container', lists.target, 'target', spellToLoad.target);
        populateSelect('range-container', lists.range, 'range', spellToLoad.range);
        populateSelect('duration-container', lists.duration, 'duration', spellToLoad.duration);
        document.getElementById('effect').value = spellToLoad.effect || '';
        populateSelect('cooldown-container', lists.cooldown, 'cooldown', spellToLoad.cooldown);
        populateSelect('cost-container', lists.cost, 'cost', spellToLoad.cost);
        populateSelect('defense-container', lists.defense, 'defense', spellToLoad.defense);
        populateSelect('attack-container', lists.attack, 'attack', spellToLoad.attack);
        clearAndPopulateDynamicInputs('restrictions', 'restrictions-container', 'placeholder_restrictions', spellToLoad.restrictions);
        clearAndPopulateDynamicInputs('upgrades', 'upgrades-container', 'placeholder_upgrades', spellToLoad.upgrades);
        showTab('spell-creator'); // Switch to creator tab
    } else if (!spellName) {
        alert('No spell to load.');
    } else {
        alert(`Spell "${spellName}" not found.`);
    }
}

function clearForm() {
    document.getElementById('spell-form').reset();
    populateDropdowns(); // Re-populate dropdowns with default values
    clearAndPopulateDynamicInputs('level', 'level-container', 'placeholder_level');
    clearAndPopulateDynamicInputs('restrictions', 'restrictions-container', 'placeholder_restrictions');
    clearAndPopulateDynamicInputs('upgrades', 'upgrades-container', 'placeholder_upgrades');
}

function deleteSpell(spellName) {
    const confirmation = confirm(translations[currentLanguage].confirm_delete);
    if (confirmation) {
        savedSpells = savedSpells.filter(spell => spell.name !== spellName);
        localStorage.setItem('savedSpells', JSON.stringify(savedSpells));
        updateSpellList();
    }
}

function updateSpellList() {
    const tableBody = document.getElementById('spell-table-body');
    tableBody.innerHTML = '';
    const filterName = document.getElementById('filter-name').value.toLowerCase();
    const filterPowerSet = document.getElementById('filter-power-set').value;
    const filterPowerSetTree = document.getElementById('filter-power-set-tree').value;
    const filterType = document.getElementById('filter-type').value;

    const filteredSpells = savedSpells.filter(spell => {
        const matchesName = spell.name.toLowerCase().includes(filterName);
        const matchesPowerSet = filterPowerSet === "" || spell.powerSet === filterPowerSet;
        const matchesPowerSetTree = filterPowerSetTree === "" || spell.powerSetTree === filterPowerSetTree;
        const matchesType = filterType === "" || spell.type === filterType;
        return matchesName && matchesPowerSet && matchesPowerSetTree && matchesType;
    });

    if (filteredSpells.length === 0 && filterName.length > 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 5;
        cell.textContent = "No spells found matching your filter.";
        return;
    }

    filteredSpells.forEach(spell => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = spell.name;
        row.insertCell(1).textContent = spell.powerSet;
        row.insertCell(2).textContent = spell.powerSetTree;
        row.insertCell(3).textContent = spell.type;
        row.insertCell(4).textContent = spell.action;

        const actionsCell = row.insertCell(5);
        actionsCell.classList.add('actions');
        const viewButton = document.createElement('button');
        viewButton.textContent = translations[currentLanguage].modal_title.split(':')[0]; // "Spell Details" -> "Spell"
        viewButton.onclick = () => showSpellDetails(spell);
        actionsCell.appendChild(viewButton);

        const editButton = document.createElement('button');
        editButton.textContent = translations[currentLanguage].edit_spell;
        editButton.onclick = () => loadSpell(spell.name);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = translations[currentLanguage].delete_spell;
        deleteButton.onclick = () => deleteSpell(spell.name);
        actionsCell.appendChild(deleteButton);
    });
}


function showSpellDetails(spell) {
    const modal = document.getElementById('spell-modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `<h3>${translations[currentLanguage].modal_title}</h3>`;

    const detailsTable = document.createElement('table');
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_spell_name}</th><td>${spell.name}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_spell_type}</th><td>${spell.type}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_power_set}</th><td>${spell.powerSet}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_power_set_tree}</th><td>${spell.powerSetTree}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_level}</th><td>${spell.level.join(', ')}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_description}</th><td>${spell.description}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_action}</th><td>${spell.action}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_target}</th><td>${spell.target.join(', ')}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_range}</th><td>${spell.range.join(', ')}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_duration}</th><td>${spell.duration.join(', ')}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_effect}</th><td>${spell.effect}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_cooldown}</th><td>${spell.cooldown.join(', ')}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_cost}</th><td>${spell.cost.join(', ')}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_defense}</th><td>${spell.defense.join(', ')}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_attack}</th><td>${spell.attack.join(', ')}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_restrictions}</th><td>${spell.restrictions.join(', ')}</td></tr>`;
    detailsTable.innerHTML += `<tr><th>${translations[currentLanguage].label_upgrades}</th><td>${spell.upgrades.join(', ')}</td></tr>`;
    modalContent.appendChild(detailsTable);

    const modalButtons = document.createElement('div');
    modalButtons.classList.add('modal-buttons');
    const closeButton = document.createElement('button');
    closeButton.textContent = translations[currentLanguage].close_modal;
    closeButton.onclick = () => modal.style.display = 'none';
    modalButtons.appendChild(closeButton);
    modalContent.appendChild(modalButtons);

    modal.style.display = 'flex';
}

// List management
function showManagedList() {
    const listType = document.getElementById('manager-list-type').value;

    // Hide all sections first
    document.querySelectorAll('[id^="manager-"][id$="-section"]').forEach(section => {
        section.style.display = 'none';
    });

    if (listType) {
        document.getElementById(`manager-${listType}-section`).style.display = 'block';
        if (listType === 'powerSets') {
            loadPowerSetsForEdit();
        } else {
            populateManagerList(listType);
        }
    }
}

function populateManagerList(listType) {
    const listDiv = document.getElementById(`${listType}-list`);
    listDiv.innerHTML = '';
    lists[listType].forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('list-item');
        div.textContent = item;
        const button = document.createElement('button');
        button.textContent = translations[currentLanguage].remove_button;
        button.onclick = () => removeListItem(listType, index);
        div.appendChild(button);
        listDiv.appendChild(div);
    });
}

function addListItem(listType, inputId) {
    const input = document.getElementById(inputId);
    const newItem = input.value.trim();
    if (newItem && !lists[listType].includes(newItem)) {
        lists[listType].push(newItem);
        lists[listType].sort();
        localStorage.setItem('dropdownData', JSON.stringify(lists));
        input.value = '';
        populateManagerList(listType);
        populateDropdowns(); // Update all relevant dropdowns
    }
}

function removeListItem(listType, index) {
    lists[listType].splice(index, 1);
    localStorage.setItem('dropdownData', JSON.stringify(lists));
    populateManagerList(listType);
    populateDropdowns(); // Update all relevant dropdowns
}

function loadPowerSetsForEdit() {
    const powerSetListDiv = document.getElementById('power-set-list');
    powerSetListDiv.innerHTML = '';
    Object.keys(lists.powerSets).sort().forEach(powerSet => {
        const div = document.createElement('div');
        div.classList.add('list-item');
        div.textContent = powerSet;
        const button = document.createElement('button');
        button.textContent = translations[currentLanguage].remove_button;
        button.onclick = () => removePowerSet(powerSet);
        div.appendChild(button);
        powerSetListDiv.appendChild(div);
    });
    loadPowerSetTreeForEdit(); // Load the tree for the currently selected power set
}

function addPowerSet() {
    const input = document.getElementById('new-power-set');
    const newPowerSet = input.value.trim();
    if (newPowerSet && !lists.powerSets[newPowerSet]) {
        lists.powerSets[newPowerSet] = [];
        localStorage.setItem('dropdownData', JSON.stringify(lists));
        input.value = '';
        loadPowerSetsForEdit();
        populateDropdowns(); // Update all relevant dropdowns
    }
}

function removePowerSet(powerSet) {
    const confirmation = confirm(`Are you sure you want to delete the Power Set "${powerSet}" and all its trees?`);
    if (confirmation) {
        delete lists.powerSets[powerSet];
        localStorage.setItem('dropdownData', JSON.stringify(lists));
        loadPowerSetsForEdit();
        populateDropdowns(); // Update all relevant dropdowns
    }
}

function loadPowerSetTreeForEdit() {
    const powerSetSelect = document.getElementById('power-set-select');
    powerSetSelect.innerHTML = ''; // Clear existing options
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = translations[currentLanguage].label_power_set_select;
    powerSetSelect.appendChild(defaultOption);

    Object.keys(lists.powerSets).sort().forEach(powerSet => {
        const option = document.createElement('option');
        option.value = powerSet;
        option.textContent = powerSet;
        powerSetSelect.appendChild(option);
    });

    const selectedPowerSet = powerSetSelect.value;
    const powerSetTreeListDiv = document.getElementById('power-set-tree-list');
    powerSetTreeListDiv.innerHTML = '';

    if (selectedPowerSet && lists.powerSets[selectedPowerSet]) {
        lists.powerSets[selectedPowerSet].forEach((tree, index) => {
            const div = document.createElement('div');
            div.classList.add('list-item');
            div.textContent = tree;
            const button = document.createElement('button');
            button.textContent = translations[currentLanguage].remove_button;
            button.onclick = () => removePowerSetTree(selectedPowerSet, index);
            div.appendChild(button);
            powerSetTreeListDiv.appendChild(div);
        });
    }
}

function addPowerSetTree() {
    const powerSetSelect = document.getElementById('power-set-select');
    const selectedPowerSet = powerSetSelect.value;
    const input = document.getElementById('new-power-set-tree');
    const newTree = input.value.trim();

    if (selectedPowerSet && newTree && !lists.powerSets[selectedPowerSet].includes(newTree)) {
        lists.powerSets[selectedPowerSet].push(newTree);
        lists.powerSets[selectedPowerSet].sort();
        localStorage.setItem('dropdownData', JSON.stringify(lists));
        input.value = '';
        loadPowerSetTreeForEdit();
        populateDropdowns(); // Update all relevant dropdowns
    }
}

function removePowerSetTree(powerSet, index) {
    lists.powerSets[powerSet].splice(index, 1);
    localStorage.setItem('dropdownData', JSON.stringify(lists));
    loadPowerSetTreeForEdit();
    populateDropdowns(); // Update all relevant dropdowns
}

// Data export/import
function exportData() {
    const data = {
        dropdownData: lists,
        savedSpells: savedSpells
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grimoire_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (importedData.dropdownData && importedData.savedSpells) {
                lists = importedData.dropdownData;
                savedSpells = importedData.savedSpells;
                localStorage.setItem('dropdownData', JSON.stringify(lists));
                localStorage.setItem('savedSpells', JSON.stringify(savedSpells));
                alert('Data imported successfully!');
                populateDropdowns(); // Re-populate all dropdowns
                updateSpellList(); // Re-render spell list
                showManagedList(); // Re-render managed lists
            } else {
                alert('Invalid JSON file format. Missing dropdownData or savedSpells.');
            }
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };
    reader.readAsText(file);
}


// Tooltip for spell attributes
let tooltipTimeout;

document.addEventListener('mouseover', function(event) {
    const target = event.target;
    if (target.classList.contains('tooltip')) {
        const tooltipText = target.getAttribute('data-tooltip');
        if (tooltipText) {
            const tooltipDiv = document.getElementById('spell-tooltip');
            let content = `<h4>${target.textContent}</h4>`;
            content += `<div class="tooltip-description"><p>${tooltipText}</p></div>`;
            tooltipDiv.innerHTML = content;
            
            // Positioning the tooltip near the mouse
            tooltipDiv.style.left = `${event.clientX}px`;
            tooltipDiv.style.top = `${event.clientY + 20}px`; // Offset a bit from the cursor
            tooltipDiv.style.display = 'grid'; // Ensure it's displayed for calculation
            tooltipDiv.style.opacity = '0'; // Keep it hidden while positioning

            // Adjust position to keep it within viewport
            const rect = tooltipDiv.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                tooltipDiv.style.left = `${window.innerWidth - rect.width - 10}px`;
            }
            if (rect.bottom > window.innerHeight) {
                tooltipDiv.style.top = `${window.innerHeight - rect.height - 10}px`;
            }
            if (rect.left < 0) {
                tooltipDiv.style.left = `10px`;
            }
            if (rect.top < 0) {
                tooltipDiv.style.top = `10px`;
            }
            
            clearTimeout(tooltipTimeout);
            tooltipTimeout = setTimeout(() => {
                tooltipDiv.style.opacity = '1';
            }, 100); // Small delay before showing
        }
    }
});

document.addEventListener('mouseout', function(event) {
    if (event.target.classList.contains('tooltip')) {
        clearTimeout(tooltipTimeout);
        const tooltipDiv = document.getElementById('spell-tooltip');
        tooltipDiv.style.opacity = '0';
        // Optional: Hide after transition
        tooltipDiv.addEventListener('transitionend', function handler() {
            tooltipDiv.style.display = 'none';
            tooltipDiv.removeEventListener('transitionend', handler);
        });
    }
});

function updateTooltipContent(element, tooltipText) {
    // This function is meant to update the tooltip for dynamic inputs
    // It's called on 'input' event to ensure the tooltip reflects current input
    if (element.classList.contains('tooltip')) {
        element.setAttribute('data-tooltip', tooltipText);
    }
}


// Drag and Drop for tabs
let draggedTab = null;

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('dragstart', (e) => {
        draggedTab = tab;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tab.dataset.tab);
        setTimeout(() => tab.classList.add('dragging'), 0);
    });

    tab.addEventListener('dragover', (e) => {
        e.preventDefault();
        const boundingBox = tab.getBoundingClientRect();
        const offset = boundingBox.right - e.clientX;
        if (offset < boundingBox.width / 2) {
            tab.style.borderRight = '2px solid #00A3E0';
            tab.style.borderLeft = 'none';
        } else {
            tab.style.borderLeft = '2px solid #00A3E0';
            tab.style.borderRight = 'none';
        }
    });

    tab.addEventListener('dragleave', () => {
        tab.style.borderLeft = 'none';
        tab.style.borderRight = 'none';
    });

    tab.addEventListener('drop', (e) => {
        e.preventDefault();
        tab.style.borderLeft = 'none';
        tab.style.borderRight = 'none';
        if (draggedTab && draggedTab !== tab) {
            const tabsContainer = document.getElementById('tabs');
            const draggedTabIndex = Array.from(tabsContainer.children).indexOf(draggedTab);
            const targetTabIndex = Array.from(tabsContainer.children).indexOf(tab);

            if (draggedTabIndex < targetTabIndex) {
                tabsContainer.insertBefore(draggedTab, tab.nextSibling);
            } else {
                tabsContainer.insertBefore(draggedTab, tab);
            }
            updateTabOrder();
        }
    });

    tab.addEventListener('dragend', () => {
        draggedTab.classList.remove('dragging');
        document.querySelectorAll('.tab').forEach(t => {
            t.style.borderLeft = 'none';
            t.style.borderRight = 'none';
        });
        draggedTab = null;
    });
});

function updateTabOrder() {
    tabOrder = Array.from(document.querySelectorAll('.tab')).map(tab => tab.dataset.tab);
    localStorage.setItem('tabOrder', JSON.stringify(tabOrder));
}

function restoreTabOrder() {
    const tabsContainer = document.getElementById('tabs');
    const fragment = document.createDocumentFragment();
    tabOrder.forEach(tabId => {
        const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
        if (tab) {
            fragment.appendChild(tab);
        }
    });
    tabsContainer.appendChild(fragment);
}


// Initialization
document.addEventListener('DOMContentLoaded', () => {
    restoreTabOrder();
    updateLanguage(); // Set initial language and button texts
    populateDropdowns(); // Populate dropdowns with data
    showTab(localStorage.getItem('activeTab') || 'spell-creator');
    showManagedList(); // Initialize the list manager's display state


    // Filter input event and blur to hide autocomplete
    document.getElementById('filter-name').addEventListener('input', updateSpellList);
    document.getElementById('filter-name').addEventListener('blur', () => {
        // Delay hiding to allow click on autocomplete item
        setTimeout(() => {
            document.getElementById('autocomplete-list').style.display = 'none';
        }, 200);
    });
    document.getElementById('filter-name').addEventListener('focus', () => {
        // Show autocomplete list on focus if there's already text
        if (document.getElementById('filter-name').value.length > 0) {
            updateAutocomplete();
        }
    });

    // Attach event listeners for filter dropdowns to update the spell list
    document.getElementById('filter-power-set').addEventListener('change', updateFilterPowerSetTree);
    document.getElementById('filter-power-set-tree').addEventListener('change', updateSpellList);
    document.getElementById('filter-type').addEventListener('change', updateSpellList);

});