// scripts/index.js
document.addEventListener('DOMContentLoaded', async () => {
  const originGrid = document.getElementById('origin-grid');
  const errorMessage = document.getElementById('error-message');
  
  try {
    const [response] = await Promise.all([
      fetch('origins.json'),
      new Promise(resolve => setTimeout(resolve, 300)) // Минимальная задержка
    ]);
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const originsData = await response.json();
    if (!originsData?.length) throw new Error('Origin data is empty or invalid');

    originGrid.innerHTML = originsData.map(origin => `
      <div class="origin-card" data-id="${origin.id}">
        <img src="images/origins/${origin.src}" alt="${origin.name}"
             onerror="this.onerror=null;this.src='images/origins/default.jpg'">
        <div class="overlay">${origin.name}</div>
      </div>
    `).join('');

    originGrid.querySelectorAll('.origin-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = `origin.html?id=${card.dataset.id}`;
      });
    });
  } catch (error) {
    console.error('Error:', error);
    errorMessage.textContent = `Error: ${error.message}`;
    errorMessage.style.display = 'block';
  }
});