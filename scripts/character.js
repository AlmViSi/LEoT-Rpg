// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyATqz2FEvuqJuFpeRNWs7MZ_G-jeEPk_dA",
    authDomain: "leot-rpg.firebaseapp.com",
    databaseURL: "https://leot-rpg-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "leot-rpg",
    storageBucket: "leot-rpg.appspot.com",
    messagingSenderId: "778831773412",
    appId: "1:778831773412:web:b27c883c463e41a25d36f1",
    measurementId: "G-P40D2VF1TQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const portraitUpload = document.getElementById('portrait-upload');
    const portraitContainer = document.getElementById('character-portrait');
    const statButtons = document.querySelectorAll('.stat-btn');
    const pointsLeftElement = document.getElementById('points-left');
    const loadUidInput = document.getElementById('load-uid-input');
    
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
    initParticles();
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

    function handleStatButtonClick() {
        const stat = this.getAttribute('data-stat');
        const action = this.getAttribute('data-action');
        
        if (action === 'increase' && pointsLeft > 0 && stats[stat] < 10) {
            stats[stat]++;
            pointsLeft--;
        } else if (action === 'decrease' && stats[stat] > 0) {
            stats[stat]--;
            pointsLeft++;
        }
        
        updateStats();
    }

    function updateStats() {
        // Update base stats
        for (const stat in stats) {
            document.getElementById(`${stat}-value`).textContent = stats[stat];
        }
        
        // Update points left
        pointsLeftElement.textContent = pointsLeft;
        
        // Update derived stats
        updateDerivedStats();
    }
    
    function updateDerivedStats() {
        const { str, con, dex, agi, int, wis, cha } = stats;
        
        // Health and combat stats
        document.getElementById('health-value').textContent = (con + str) * 20;
        document.getElementById('might-value').textContent = str + dex;
        document.getElementById('combat-value').textContent = 10 + Math.floor((str + agi) / 2);
        document.getElementById('threat-value').textContent = Math.floor((str + int) / 2);
        
        // Mental and social stats
        document.getElementById('influence-value').textContent = Math.floor((str + wis) / 2);
        document.getElementById('composure-value').textContent = 10 + Math.floor((str + cha) / 2);
        document.getElementById('resilience-value').textContent = 10 + Math.floor((con + dex) / 2);
        
        // Reaction and focus stats
        document.getElementById('reactions-value').textContent = Math.floor((con + agi) / 4);
        document.getElementById('vigilance-value').textContent = 10 + Math.floor((con + int) / 2);
        document.getElementById('concentration-value').textContent = Math.floor((con + wis) / 4);
        
        // Charisma and magic stats
        document.getElementById('charisma-value').textContent = Math.floor((con + cha) / 4);
        document.getElementById('premonition-value').textContent = Math.floor((dex + agi) / 4);
        document.getElementById('skills-value').textContent = 4 + dex + int;
        
        // Physical stats
        document.getElementById('focus-value').textContent = (dex + wis) * 20;
        document.getElementById('willpower-value').textContent = 10 + Math.floor((dex + cha) / 2);
        document.getElementById('mastery-value').textContent = agi + int;
        
        // Defense stats
        document.getElementById('evasion-value').textContent = 10 + Math.floor((agi + wis) / 2);
        document.getElementById('grace-value').textContent = Math.floor((agi + cha) / 4);
        document.getElementById('logic-value').textContent = 10 + Math.floor((int + wis) / 2);
        
        // Special stats
        document.getElementById('traits-value').textContent = Math.floor((cha + int) / 2);
        document.getElementById('witchcraft-value').textContent = wis + cha;
    }
    
    function generateCharacterUID() {
        const uid = 'xxxx-xxxx'.replace(/[x]/g, () => 
            Math.floor(Math.random() * 16).toString(16)
        );
        document.getElementById('character-uid').value = uid;
        loadUidInput.value = uid;
    }
    
    function saveCharacter() {
        const uid = document.getElementById('character-uid').value;
        if (!uid) {
            alert('Please generate a UID first');
            return;
        }
        
        const characterData = {
            name: document.getElementById('character-name').value,
            bio: document.getElementById('character-bio').value,
            stats: stats,
            portrait: portraitContainer.querySelector('img')?.src || '',
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        
        database.ref('characters/' + uid).set(characterData)
            .then(() => alert(`Character saved successfully with UID: ${uid}`))
            .catch(error => {
                console.error('Error saving character:', error);
                alert(`Error saving character: ${error.message}`);
            });
    }
    
    function loadCharacter(uid) {
        if (!uid.trim()) {
            alert('Please enter a UID to load');
            return;
        }
        
        database.ref('characters/' + uid).once('value')
            .then((snapshot) => {
                const characterData = snapshot.val();
                if (!characterData) {
                    alert('No character found with this UID');
                    return;
                }
                
                // Restore character data
                document.getElementById('character-name').value = characterData.name || '';
                document.getElementById('character-bio').value = characterData.bio || '';
                document.getElementById('character-uid').value = uid;
                
                // Restore stats
                Object.keys(characterData.stats).forEach(stat => {
                    stats[stat] = characterData.stats[stat];
                });
                pointsLeft = 36 - Object.values(stats).reduce((a, b) => a + b, 0);
                
                // Restore portrait
                if (characterData.portrait) {
                    portraitContainer.innerHTML = `<img src="${characterData.portrait}" alt="Character Portrait">`;
                }
                
                updateStats();
                alert('Character loaded successfully!');
            })
            .catch(error => {
                console.error('Error loading character:', error);
                alert(`Error loading character: ${error.message}`);
            });
    }
    
    function resetCharacter() {
        if (!confirm('Are you sure you want to clear all character data?')) return;
        
        // Reset stats
        Object.keys(stats).forEach(stat => stats[stat] = 0);
        pointsLeft = 36;
        
        // Clear fields
        document.getElementById('character-name').value = '';
        document.getElementById('character-bio').value = '';
        document.getElementById('character-uid').value = '';
        loadUidInput.value = '';
        portraitContainer.innerHTML = '<span>Click to upload portrait</span>';
        document.getElementById('portrait-upload').value = '';
        
        updateStats();
    }
});