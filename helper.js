alloy("sendEvent", {
  "personalization": {
    "surfaces": ["web://devteammember.github.io/index.html#dynamic-multiple-offer-bhp-modal"] 
    // Example ID: "xcore:offer-placement:1175009612b0100c"
  }
}).then(result => {
  // Check if any propositions (offers) were returned
  if (result.propositions && result.propositions.length > 0) {
    result.propositions.forEach(proposition => {
      console.log("Placement ID (Scope):", proposition.scope);
      
      if (proposition.items && proposition.items.length > 0) {
        proposition.items.forEach(item => {
          console.log("Offer ID:", item.id);
          console.log("Offer Content:", item.data.content);
          
          // You can now use the specific offer data
          // and apply it to your web page.
          displayRandomOfferModal(item.data.content);
        });
      }
    });
  } else {
    console.log("No offers found for the specified scope.");
  }
}).catch(error => {
  console.error("Error fetching offers:", error);
});


function displayRandomOfferModal(jsonString) {
    try {
        const offers = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        
        if (!offers.length) return; // Exit if array is empty

        // 1. Pick a random index
        const randomIndex = Math.floor(Math.random() * offers.length);
        const offer = offers[randomIndex];

        // 2. Create Overlay and Modal Container
        const overlay = document.createElement('div');
        const modal = document.createElement('div');

        console.log(offer);

        // 3. Build HTML for the SINGLE random offer
        modal.innerHTML = `
            <div style="text-align: center; font-family: 'Helvetica Neue', Arial, sans-serif;">
                <span style="background: #006fcf; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
                    ${offer.offerCategory} Exclusive
                </span>
                
                <p style="color: #666; line-height: 1.5; margin-bottom: 20px;">${offer.offerDescription}</p>
                
                <a href="${offer.offerCTAActionURL}" 
                   target="${offer.offerCTAActionTarget}" 
                   style="display: block; background: #006fcf; color: white; padding: 12px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-bottom: 10px;">
                   ${offer.offerName}
                </a>
                
                <button id="close-modal" style="background: none; border: none; color: #888; cursor: pointer; font-size: 14px; text-decoration: underline;">
                    Dismiss
                </button>
            </div>
        `;

        // 4. Styling (2026 Modern UI)
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
            justifyContent: 'center'
        });

        Object.assign(modal.style, {
            background: 'white', padding: '40px', borderRadius: '16px',
            maxWidth: '400px', width: '85%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        });

        // 5. Append and Close Logic
        document.body.appendChild(overlay);
        overlay.appendChild(modal);

        document.getElementById('close-modal').onclick = () => document.body.removeChild(overlay);

    } catch (e) {
        console.error("Error picking random offer:", e);
    }
}

