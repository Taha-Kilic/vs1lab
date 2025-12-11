// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...

    #geoTagMultiSet = []

    constructor() {}

    get geoTagMultiSet() {
        return this.#geoTagMultiSet
    }

    addGeoTag(geotag) {
        this.#geoTagMultiSet.push(geotag);
    }

    removeGeoTag(name) {
        this.#geoTagMultiSet = this.#geoTagMultiSet.filter(
            tag => tag.name !== name
        );
        
    }

    getNearbyGeoTags(locationGeotag, radius) {
        return this.#geoTagMultiSet.filter(
            tag => locationGeotag.getDistanceFrom(tag) <= radius
        );
    }

    searchNearbyGeoTags(keyword, locationGeoTag, radius) {
        return this.#geoTagMultiSet.filter(
            tag => (
                // 1. Keyword match: Check if the keyword is in the name or hashtag (case-sensitivity may need adjustment)
                tag.name.includes(keyword) || 
                tag.hashtag.includes(keyword)
            ) && (
                // 2. Proximity match: Check distance from the center location to the tag
                locationGeoTag.getDistanceFrom(tag) <= radius
            )
        );
    }

}

module.exports = InMemoryGeoTagStore
