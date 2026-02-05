// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");
import GeoTag from '../models/geotag.js';

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

/**
 * Update the discovery results list and map with new tags
 * @param {Array} tags - Array of GeoTag objects to display
 */
function updateDiscoveryResults(tags) {
    // Update the discovery results list
    const resultsList = document.getElementById("discoveryResults");
    resultsList.innerHTML = '';
    
    if (tags && tags.length > 0) {
        tags.forEach(tag => {
            const li = document.createElement('li');
            li.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`;
            resultsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No results found';
        resultsList.appendChild(li);
    }
    
    // Update the map with new markers
    const currentLat = parseFloat(document.getElementById("tagLatHidden").value);
    const currentLong = parseFloat(document.getElementById("tagLongHidden").value);
    mapManager.updateMarkers(currentLat, currentLong, tags || []);
}

/**
 * Handle the tagging form submission via AJAX (POST)
 * @param {Event} event - Form submission event
 */
function handleTaggingSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = document.getElementById("tagName").value;
    const hashtag = document.getElementById("tagHash").value;
    const latitude = parseFloat(document.getElementById("tagLat").value);
    const longitude = parseFloat(document.getElementById("tagLong").value);
    
    // Validate form inputs (preserve validation from Aufgabe 1)
    if (!name || !hashtag || isNaN(latitude) || isNaN(longitude)) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create GeoTag object using the GeoTag class constructor
    const newGeoTag = new GeoTag(latitude, longitude, name, hashtag);
    
    // Send POST request via Fetch API with JSON body
    fetch('/api/geotags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGeoTag)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create GeoTag');
        }
        return response.json();
    })
    .then(createdTag => {
        console.log('Tag created successfully:', createdTag);
        // Clear the form
        form.reset();
        // Update discovery results with nearby tags
        return fetchAndUpdateDiscoveryResults(latitude, longitude, '');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create tag: ' + error.message);
    });
}

/**
 * Handle the discovery form submission via AJAX (GET)
 * @param {Event} event - Form submission event
 */
function handleDiscoverySubmit(event) {
    event.preventDefault();
    
    const latitude = parseFloat(document.getElementById("tagLatHidden").value);
    const longitude = parseFloat(document.getElementById("tagLongHidden").value);
    const searchTerm = document.getElementById("searchterm").value;
    
    fetchAndUpdateDiscoveryResults(latitude, longitude, searchTerm);
}

/**
 * Fetch discovery results via AJAX (GET request with query parameters)
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {string} searchTerm - Search term filter
 */
function fetchAndUpdateDiscoveryResults(latitude, longitude, searchTerm) {
    let url = `/api/geotags?latitude=${latitude}&longitude=${longitude}`;
    
    if (searchTerm) {
        url += `&searchterm=${encodeURIComponent(searchTerm)}`;
    }
    
    // Send GET request via Fetch API
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch GeoTags');
        }
        return response.json();
    })
    .then(tags => {
        console.log('Tags fetched successfully:', tags);
        updateDiscoveryResults(tags);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch tags: ' + error.message);
    });
}

// A4 - Register event listeners for form submissions

// Wait for the page to fully load its DOM content, then call updateLocation and register event listeners
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    
    // Register event listener for tagging form (AJAX POST)
    const tagForm = document.getElementById("tag-form");
    if (tagForm) {
        tagForm.addEventListener("submit", handleTaggingSubmit);
    }
    
    // Register event listener for discovery form (AJAX GET)
    const discoveryForm = document.getElementById("discoveryFilterForm");
    if (discoveryForm) {
        discoveryForm.addEventListener("submit", handleDiscoverySubmit);
    }
});
