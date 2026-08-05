document.addEventListener('DOMContentLoaded', () => {
  // Solo ejecuta si encuentra elementos que necesitan ser llenados
  const founderElements = document.querySelectorAll('[data-founder-product]');
  const slotBar = document.getElementById('founder-slots-bar');
  const slotText = document.getElementById('founder-slots-text');

  if (founderElements.length > 0 || slotBar) {
    // Determinar la ruta relativa correcta (dependiendo de si estamos en / o en /apps/)
    let jsonPath = 'assets/data/founders.json';
    if (window.location.pathname.includes('/apps/') || window.location.pathname.includes('/ecosistemas/')) {
        jsonPath = '../assets/data/founders.json';
    }

    fetch(jsonPath)
      .then(response => response.json())
      .then(data => {
        if (!data.active) return;

        // 1. Update progress bar if it exists
        if (slotBar && slotText) {
          if (data.showExactSlots) {
             const percentage = (data.usedSlots / data.totalSlots) * 100;
             slotBar.style.width = percentage + '%';
             slotText.textContent = `${data.usedSlots} de ${data.totalSlots} lugares ocupados en la Etapa ${data.stage}`;
          } else {
             slotText.textContent = 'Etapa Fundadores Activa';
             slotBar.style.width = '100%';
          }
        }

        // 2. Update prices across the site
        founderElements.forEach(el => {
          const productKey = el.getAttribute('data-founder-product');
          const typeKey = el.getAttribute('data-founder-type'); // 'founder', 'regular', 'both'
          
          if (data.products[productKey]) {
            const prod = data.products[productKey];
            
            if (typeKey === 'founder') {
               el.innerHTML = `$${prod.founderPrice} <span style="font-size:0.6em;">${prod.currency}</span>`;
            } else if (typeKey === 'regular') {
               el.innerHTML = `<s>$${prod.regularPrice}</s>`;
            } else if (typeKey === 'both-inline') { // For compact displays like in aplicaciones.html
               el.innerHTML = `<s>$${prod.regularPrice}</s> $${prod.founderPrice} ${prod.currency}`;
            } else if (typeKey === 'card') { // Custom structure for pricing cards
               el.innerHTML = \`<div style="font-size:2rem; font-weight:900; color:#fff; margin:10px 0;">$${prod.founderPrice} <span style="font-size:0.85rem;">${prod.currency}</span></div>
                                <div style="font-size:0.9rem; color:var(--tenkai-muted);">Precio público previsto: $${prod.regularPrice} ${prod.currency}</div>\`;
            }
          }
        });
      })
      .catch(err => console.error('Error loading founders data:', err));
  }
});
