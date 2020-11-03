import { Injectable } from '@angular/core';
import { Loader } from 'google-maps';

@Injectable({
    providedIn: 'root',
})
export class MapsService {
    clientKey = 'AIzaSyBj_a4fha9f1CtqfTfQYKUmEFfXF21UaFU';
    googleMaps;
    loader: Loader;

    constructor() {}

    async getGoogleMaps() {
        if (!this.loader) {
            this.loader = new Loader(this.clientKey);
        }

        if (!this.googleMaps) {
            this.googleMaps = await this.loader.load();
        }

        return this.googleMaps;
    }
}
