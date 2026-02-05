function renderSpecificOffer(id, name, type) {

   
    async function getLocation(id, name, type) {
        const response = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
        const data = await response.json();

        const city = data.locality;
        const state = data.principalSubdivisionCode.split("-")[1];
        renderOffers(city, state, id, name, type);
        console.log(`You are in ${city}, ${state}`);
    }

    getLocation();



    function renderOffers(city, state, id, name, type) {
        const userCity = 'Novi';
        const userState = 'MI';
        const timestamp = new Date().toISOString();

        const uuid = crypto.randomUUID();




        alloy('getIdentity').then(result => {
            const requestECID = result.identity.ECID;

             const windowURL = window.location.href.replaceAll('#', '');
            const payload = {
                renderDecisions: true,
                personalization: {
                    surfaces: ["web://devteammember.github.io/index.html#dynamic-aa-landing-page-offers"]
                },
                xdm: {

                    "_accenture_partner": {
                        "interactionDetails": {
                            "actionId": id,
                            "actionName": name,
                            "actionType": type,
                            "actionURL": windowURL
                        },
                        "offerContextData": {
                            "deviceDetails": {
                                "deviceType": "web"
                            },
                            "languageDetails": {
                                "language": "en-us"
                            },
                            "locationDetails": {
                                "city": userCity,
                                "state": userState
                            },
                            "modelDetails": [
                                {
                                    "modelId": "150",
                                    "modelScore": 1.00
                                }
                            ],
                            "weatherDetails": {
                                "season": "winter",
                                "temperature": 26.00
                            }
                        },
                        "userInfo": {
                            "customerProfileId": "e5413fd6c876b4439650dda80c6d6e4e26a7736dfbacde63c16c07b943b0ec86",
                            "loyaltyType": "diamond",
                            "trackId": "150",
                            "trackScore": 1.00,
                            "userEmailAddress": "shashi.chennachar@accenture.com"
                        },
                        "webPageDetails": {
                            "pageTitle": "Apex Athletics | Performance Sports Apparel",
                            "pageType": "brand-home-page",
                            "pageURL": "https://devteammember.github.io/index.html"
                        }
                    },
                    "_id": uuid,
                    "eventMergeId": uuid,
                    "eventType": "loadlandingpage.completes",
                    "identityMap": {
                        "ECID": [
                            {
                                "authenticatedState": "ambiguous",
                                "id": "55321540974260886512506908987831659625",
                                "primary": false
                            }
                        ],
                        "AA-MEMBER": [
                            {
                                "authenticatedState": "authenticated",
                                "id": "e5413fd6c876b4439650dda80c6d6e4e26a7736dfbacde63c16c07b943b0ec86",
                                "primary": true
                            }
                        ]
                    },
                    "producedBy": "self",
                    "timestamp": timestamp

                },
                edgeConfigOverrides: {
                    datastreamId: "78d9783d-fe47-4ba4-baec-fe307d6d7e3d"
                }
            };            
            if (typeof alloy === "function") {

                alloy("sendEvent", payload).then(result => {
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
            }

        });

    }




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
                    <span style="background: #ff3e3e; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
                        ${offer.offerCategory} Exclusive
                    </span>
                
                    <p style="color: #666; line-height: 1.5; margin-bottom: 20px;">${offer.offerDescription}</p>
                
                    <a href="${offer.offerCTAActionURL}" 
                       target="${offer.offerCTAActionTarget}" 
                       style="display: block; background: #ff3e3e; color: white; padding: 12px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-bottom: 10px;">
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



}
