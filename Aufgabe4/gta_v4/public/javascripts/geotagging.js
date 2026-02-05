// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

class GeoTag {

    // TODO: ... your code here ...

    latitude;
    longitude;
    name;
    hashtag;

    constructor(latitude, longitude, name, hashtag) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.hashtag = hashtag;
    }

}

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
           
async function tagFormSubmitHandler(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const lat = parseFloat(document.getElementById("tagLat").value);
    const long = parseFloat(document.getElementById("tagLong").value);
    const name = document.getElementById("tagName").value;
    const hashtag = document.getElementById("tagHash").value;

    const newGeoTag = new GeoTag(lat, long, name, hashtag);

    const response = await fetch('/api/geotags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGeoTag)
    });

    if (response.ok) {
        const createdGeoTag = await response.json();
        console.log('GeoTag created:', createdGeoTag);
        
        // Clear the form
        document.getElementById("tag-form").reset();
        
        // Fetch nearby tags and update the map and list
        const nearbyResponse = await fetch(`/api/geotags?latitude=${lat}&longitude=${long}`);
        if (nearbyResponse.ok) {
            const nearbyTags = await nearbyResponse.json();
            updateMapAndTagList(nearbyTags);
            updateLocation();
        }
        

    } else {
        console.error('Failed to create GeoTag:', response.statusText);
    }

}

async function discoveryFilterSubmitHandler(event) {
    event.preventDefault(); 

    const query = document.getElementById("searchterm").value;

    const response = await fetch('/api/geotags?searchterm=' + encodeURIComponent(query), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const geoTags = await response.json();
        console.log('Search results:', geoTags);
        // Optionally, you can update the map or UI here to reflect the search results
            updateMapAndTagList(geoTags);
    } else {
        console.error('Failed to search GeoTags:', response.statusText);
    }


}

function updateMapAndTagList(geoTags) {
    // Update the discovery results list
    const resultsList = document.getElementById("discoveryResults");
    resultsList.innerHTML = '';
    
    if (geoTags && geoTags.length > 0) {
        geoTags.forEach(tag => {
            const li = document.createElement('li');
            li.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`;
            resultsList.appendChild(li);
        });
        
        // Focus on the first tag in the list
        mapManager.updateMarkers(geoTags[0].latitude, geoTags[0].longitude, geoTags);
    } else {
        const li = document.createElement('li');
        li.textContent = 'No results found';
        resultsList.appendChild(li);
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    const tagForm = document.getElementById("tag-form");
    if (tagForm) {
        tagForm.addEventListener("submit", tagFormSubmitHandler);
    }

    const discoveryFilter = document.getElementById("discoveryFilterForm");
    if (discoveryFilter) {
        discoveryFilter.addEventListener("submit", discoveryFilterSubmitHandler);
    }
        
});
