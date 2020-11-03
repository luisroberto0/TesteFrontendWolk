import { Injectable } from '@angular/core';
import { Loader } from 'google-maps';

@Injectable({
    providedIn: 'root',
})
export class MapsService {
    clientKey = 'AIzaSyCpzCIhX7FZxD38O2LKMVxoQrixauhTttU';
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
