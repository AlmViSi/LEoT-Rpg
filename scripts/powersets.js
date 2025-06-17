document.addEventListener('DOMContentLoaded', () => {
    // Инициализация Firebase
    if (typeof firebaseConfig === 'undefined') {
        console.error("firebaseConfig is not defined");
        return;
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const database = firebase.database();
    let savedSpells = JSON.parse(localStorage.getItem('savedSpells')) || [];
    
    // Функция для сохранения заклинания в Firebase
    window.saveSpellToFirebase = async function(spell) {
        try {
            const spellRef = database.ref(`public_spells/${spell.name}`);
            await spellRef.set(spell);
            console.log("Spell saved to Firebase");
        } catch (error) {
            console.error("Error saving spell to Firebase:", error);
        }
    };
    
    // Функция для загрузки всех заклинаний из Firebase
    window.loadSpellsFromFirebase = async function() {
        try {
            const snapshot = await database.ref('public_spells').once('value');
            const spells = snapshot.val() || {};
            return Object.values(spells);
        } catch (error) {
            console.error("Error loading spells from Firebase:", error);
            return [];
        }
    };
    
    // Функция для удаления заклинания из Firebase
    window.deleteSpellFromFirebase = async function(spellName) {
        try {
            await database.ref(`public_spells/${spellName}`).remove();
            console.log("Spell deleted from Firebase");
        } catch (error) {
            console.error("Error deleting spell from Firebase:", error);
        }
    };
    
    // Функция для получения значений из парных полей
    function getPairedInputValues(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        
        const result = [];
        const groups = container.querySelectorAll('.paired-input-group');
        
        groups.forEach(group => {
            const mainInput = group.querySelector('.main-input');
            const valueInput = group.querySelector('.value-input');
            
            if (mainInput && valueInput) {
                result.push({
                    type: mainInput.value,
                    value: valueInput.value
                });
            }
        });
        
        return result;
    }
    
    // Функция для сохранения заклинания (локально и в Firebase)
    window.saveSpell = function() {
        const spell = {
            name: document.getElementById('spell-name').value,
            type: getAllInputValues('spell-type-container'),
            powerSet: getAllInputValues('power-set-container'),
            powerSetTree: getAllInputValues('power-set-tree-container'),
            level: getAllInputValues('level-container'),
            description: document.getElementById('description').value,
            action: getPairedInputValues('action-container'),
            target: getPairedInputValues('target-container'),
            range: getPairedInputValues('range-container'),
            duration: getPairedInputValues('duration-container'),
            effect: document.getElementById('effect').value,
            cooldown: getPairedInputValues('cooldown-container'),
            cost: getPairedInputValues('cost-container'),
            defense: getAllInputValues('defense-container'),
            attack: getAllInputValues('attack-container'),
            restrictions: getAllInputValues('restrictions-container'),
            upgrades: getAllInputValues('upgrades-container')
        };

        const existingIndex = savedSpells.findIndex(s => s.name === spell.name);
        if (existingIndex >= 0) {
            savedSpells[existingIndex] = spell;
        } else {
            savedSpells.push(spell);
        }
        
        localStorage.setItem('savedSpells', JSON.stringify(savedSpells));
        saveSpellToFirebase(spell);
        updateSpellList();
        
        const form = document.getElementById('spell-form');
        form.classList.add('glow');
        setTimeout(() => form.classList.remove('glow'), 1000);
    };
    
    // Функция для удаления заклинания (локально и из Firebase)
    window.deleteSpell = function(index) {
        const spellName = savedSpells[index].name;
        const row = document.querySelector(`#spell-table-body tr:nth-child(${index + 1})`);
        if (row) {
            row.classList.add('removing');
            setTimeout(() => {
                savedSpells.splice(index, 1);
                localStorage.setItem('savedSpells', JSON.stringify(savedSpells));
                deleteSpellFromFirebase(spellName);
                updateSpellList();
                closeModal();
            }, 300);
        }
    };
    
    // Функция для форматирования парных значений для отображения
    function formatPairedValues(pairedArray) {
        if (!pairedArray || !pairedArray.length) return '-';
        
        return pairedArray
            .filter(item => item.type || item.value)
            .map(item => {
                if (item.type && item.value) {
                    return `${item.type}: ${item.value}`;
                }
                return item.type || item.value;
            })
            .join(', ');
    }
    
    // Функция для обновления списка заклинаний
    window.updateSpellList = function() {
        const filterName = document.getElementById('filter-name').value.toLowerCase();
        const filterPowerSet = document.getElementById('filter-power-set').value;
        const filterPowerSetTree = document.getElementById('filter-power-set-tree').value;
        const filterType = document.getElementById('filter-type').value;
        const spellTableBody = document.getElementById('spell-table-body');
        spellTableBody.innerHTML = '';

        const filteredSpells = savedSpells.filter(spell => {
            const spellType = Array.isArray(spell.type) ? spell.type.join(', ').toLowerCase() : (spell.type || '').toLowerCase();
            const spellPowerSet = Array.isArray(spell.powerSet) ? spell.powerSet.join(', ').toLowerCase() : (spell.powerSet || '').toLowerCase();
            const spellPowerSetTree = Array.isArray(spell.powerSetTree) ? spell.powerSetTree.join(', ').toLowerCase() : (spell.powerSetTree || '').toLowerCase();

            return (
                (!filterName || (spell.name && spell.name.toLowerCase().includes(filterName))) &&
                (!filterPowerSet || spellPowerSet.includes(filterPowerSet.toLowerCase())) &&
                (!filterPowerSetTree || spellPowerSetTree.includes(filterPowerSetTree.toLowerCase())) &&
                (!filterType || spellType.includes(filterType.toLowerCase()))
            );
        });

        filteredSpells.forEach((spell, index) => {
            const tr = document.createElement('tr');
            tr.addEventListener('mouseenter', (e) => showSpellTooltip(e, spell));
            tr.addEventListener('mouseleave', hideSpellTooltip);
            tr.addEventListener('mousemove', (e) => {
                const tooltip = document.getElementById('spell-tooltip');
                if (tooltip.style.opacity === '1') {
                    tooltip.style.left = `${e.clientX + 20}px`;
                    tooltip.style.top = `${e.clientY + 20}px`;
                }
            });

            tr.onclick = (e) => {
                if (!e.target.classList.contains('delete-btn')) showSpellDetails(spell, index);
            };

            const spellTypeDisplay = Array.isArray(spell.type) ? spell.type.join(', ') : (spell.type || '-');
            const spellPowerSetDisplay = Array.isArray(spell.powerSet) ? spell.powerSet.join(', ') : (spell.powerSet || '-');
            const spellPowerSetTreeDisplay = Array.isArray(spell.powerSetTree) ? spell.powerSetTree.join(', ') : (spell.powerSetTree || '-');
            const spellActionDisplay = formatPairedValues(spell.action);

            tr.innerHTML = `
                <td>${spell.name || '-'}</td>
                <td>${spellPowerSetDisplay}</td>
                <td>${spellPowerSetTreeDisplay}</td>
                <td>${spellTypeDisplay}</td>
                <td>${spellActionDisplay}</td>
                <td><button class="delete-btn" onclick="event.stopPropagation(); confirmDeleteSpell(${index})">${translations[currentLanguage].delete_spell}</button></td>
            `;
            spellTableBody.appendChild(tr);
        });

        updateAutocomplete();
    };
    
    // Инициализация при загрузке
    loadSpellsFromFirebase().then(spells => {
        if (spells.length > 0) {
            savedSpells = spells;
            localStorage.setItem('savedSpells', JSON.stringify(savedSpells));
        }
        updateSpellList();
    });
});
