// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

const mapManager = new MapManager();

function updateLocation() {
    const mapElement = document.getElementById("map");
    const taglist_json = mapElement.getAttribute("data-tags");
    const geoTags = JSON.parse(taglist_json);

    const inputLat = document.getElementById("tagLat");
    const inputLong = document.getElementById("tagLong");

    if (inputLat.value !== "" && inputLong.value !== "") {
        
        const lat = parseFloat(inputLat.value);
        const long = parseFloat(inputLong.value);
            
        mapManager.initMap(geoTags[0].latitude, geoTags[0].longitude);
        mapManager.updateMarkers(lat, long, geoTags);

         const placeholderImg = document.getElementById("bild");
        if (placeholderImg) placeholderImg.remove();

        const mapSpan = document.querySelector("#map p");
        if (mapSpan) mapSpan.remove();

        document.getElementById("map").style.height = "500px";      
        return;
    }
        
    
        LocationHelper.findLocation((locationHelper) => {

        document.getElementById("tagLat").value = locationHelper.latitude
        document.getElementById("tagLong").value = locationHelper.longitude
        document.getElementById("tagLatHidden").value = locationHelper.latitude
        document.getElementById("tagLongHidden").value = locationHelper.longitude

        // Initialize the map
        mapManager.initMap(locationHelper.latitude, locationHelper.longitude);
        mapManager.updateMarkers(locationHelper.latitude, locationHelper.longitude, geoTags);
        
        const placeholderImg = document.getElementById("bild");
        if (placeholderImg) placeholderImg.remove();

        const mapSpan = document.querySelector("#map p");
        if (mapSpan) mapSpan.remove();

        document.getElementById("map").style.height = "500px";
        });
}
       // --- A4: AJAX + REST ---
    function renderDiscoveryList(tags) {
    const ul = document.getElementById("discoveryResults");
    ul.innerHTML = ""; // clear old items

    if (!tags || tags.length === 0) return;

tags.forEach(gtag => {
    const li = document.createElement("li");
    li.textContent = `${gtag.name} ( ${gtag.latitude},${gtag.longitude}) ${gtag.hashtag ?? ""}`;
    ul.appendChild(li);
});
}

function ensureMapVisible() {
    const placeholderImg = document.getElementById("bild");
    if (placeholderImg) placeholderImg.remove();

    const mapSpan = document.querySelector("#map p");
    if (mapSpan) mapSpan.remove();

    document.getElementById("map").style.height = "500px";
}

function updateDiscoveryUI(centerLat, centerLng, tags) {
  renderDiscoveryList(tags);

  const mapElement = document.getElementById("map");
  mapElement.setAttribute("data-tags", JSON.stringify(tags || []));

  ensureMapVisible();
  mapManager.updateMarkers(centerLat, centerLng, tags || []);
}


async function handleTaggingSubmit(event) {
    event.preventDefault();

    const tagForm = document.getElementById("tag-form");

    // keep HTML5 validation (A1)
    if (!tagForm.reportValidity()) return;

    const latitude = parseFloat(document.getElementById("tagLat").value);
    const longitude = parseFloat(document.getElementById("tagLong").value);
    const name = document.getElementById("tagName").value;
    const hashtag = document.getElementById("tagHash").value;

    const payload = { latitude, longitude, name, hashtag };

    const response = await fetch("/api/geotags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        console.error("POST /api/geotags failed", response.status);
        return;
    }


    const centerLat = parseFloat(document.getElementById("tagLatHidden").value);
    const centerLng = parseFloat(document.getElementById("tagLongHidden").value);

    const params = new URLSearchParams({
        latitude: centerLat,
        longitude: centerLng,
        radius: "100",
        searchTerm: "" 
    });

    const getResp = await fetch(`/api/geotags?${params.toString()}`);
    const tags = getResp.ok ? await getResp.json() : [];


    const searchInput = document.getElementById("searchterm");
    if (searchInput) searchInput.value = "";

    updateDiscoveryUI(centerLat, centerLng, tags);
    }

    async function handleDiscoverySubmit(event) {
    event.preventDefault();

    const discoveryForm = document.getElementById("discoveryFilterForm");


    if (!discoveryForm.reportValidity()) return;

    const searchTerm = document.getElementById("searchterm").value || "";

    const centerLat = parseFloat(document.getElementById("tagLatHidden").value);
    const centerLng = parseFloat(document.getElementById("tagLongHidden").value);

    const params = new URLSearchParams({
        latitude: centerLat,
        longitude: centerLng,
        radius: "100",
        searchTerm
    });

    const response = await fetch(`/api/geotags?${params.toString()}`);
    if (!response.ok) {
        console.error("GET /api/geotags failed", response.status);
        return;
    }

    const tags = await response.json();
    updateDiscoveryUI(centerLat, centerLng, tags);
    }

           
    



document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

   
    const tagForm = document.getElementById("tag-form");
    const discoveryForm = document.getElementById("discoveryFilterForm");

    if (tagForm) tagForm.addEventListener("submit", handleTaggingSubmit);
    if (discoveryForm) discoveryForm.addEventListener("submit", handleDiscoverySubmit);
});
