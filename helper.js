window.addEventListener("load", function () {

    let city = '';
    let state = '';

    async function getCityStateFromCoordinates(latitude, longitude, apiKey) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        debugger;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Check if the API call was successful and returned results
            if (data.status === 'OK' && data.results.length > 0) {
                const addressComponents = data.results[0].address_components;
                

                // Loop through address components to find city and state
                for (const component of addressComponents) {
                    if (component.types.includes('locality')) {
                        city = component.long_name;
                    }
                    if (component.types.includes('administrative_area_level_1')) {
                        state = component.short_name; // Use short_name for state abbreviation
                    }
                }

                console.log(`City: ${city}`);
                console.log(`State: ${state}`);
                return { city, state };

            } else {
                console.log('No results found or API error occurred.');
                console.log('API Status:', data.status);
            }
        } catch (error) {
            console.error('Error fetching geocoding data:', error);
        }
    }


    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Geolocation is not supported by your browser.");
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        const API_KEY = 'AIzaSyAvAsK9b1ZYY9i4xthAnwaO5qugA-LC2DI';


        getCityStateFromCoordinates(latitude, longitude, API_KEY);

    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }


    const userCity = city;
    const userState = state;
    const timestamp = new Date().toISOString();

    const uuid = crypto.randomUUID();


    const requestECID = '';

    alloy('getIdentity').then(result => {
        requestECID = result.identity.ECID;
    });
    

    const payload = {
        renderDecisions: true,
        personalization: {
            surfaces: ["web://devteammember.github.io/index.html#dynamic-aa-landing-page-offers"]
        },
        xdm: {
            _accenture_partner: {
                interactionDetails: {
                    actionId: "landing-on-aa-home-page",
                    actionName: "Landing on AA Home Page",
                    actionType: "open",
                    actionURL: "https://devteammember.github.io/index.html"
                },
                locationDetails: {
                    city: userCity, // Dynamic City
                    state: userState // Dynamic State
                }
                webPageDetails: {
                    pageTitle: "Apex Athletics || Home Page",
                    pageType: "brand-home-page",
                    pageURL: "https://devteammember.github.io/index.html"
                }
            },
            _id: uuid,
            eventMergeId: uuid,
            eventType: "web.interactions.open.landing.page",
            identityMap: {
                ECID: [{
                    authenticatedState: "ambiguous",
                    id: requestECID,
                    primary: false
                }]]
            },
            producedBy: "self",
            timestamp: timestamp
        },
        edgeConfigOverrides: {
            datastreamId: "c05882a0-63a0-45c4-bce1-a46b86bab46a"
        }
    };

    debugger;
    // Your code here will run after the entire page and all its resources have loaded
    console.log("Window fully loaded. Running function.");
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

