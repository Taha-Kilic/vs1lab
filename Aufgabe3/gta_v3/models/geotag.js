// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    // TODO: ... your code here ...

    #latitude;
    #longitude;
    #name;
    #hash;

    constructor(name, latitude, longitude, hash) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.hash = hash;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    get hash(){
        return this.#hash;
    }

    set hash(hash) {
        this.#hash = hash;
    }

    get longitude() {
        return this.#longitude
    }

    set longitude(longitude) {
        this.#longitude = longitude
    }

    get latitude() {
        return this.#latitude
    }

    set latitude(latitude) {
        this.#latitude = latitude;
    }

}

module.exports = GeoTag;
