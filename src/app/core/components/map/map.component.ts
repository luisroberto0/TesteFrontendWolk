import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MapsService } from '../../services/map.service';

interface ILocation {
    title: string;
    lng: string;
    lat: string;
    id?: number;
    subtype?: string;
    type?: string;
    type_slug?: string;
    image?: string;
    description?: string;
    address?: string;
    content_type?: string;
    alias?: string;
    weather?: any;
}

interface IRelated {
    name: string;
    related_objects: ILocation[];
}

interface IType {
    title: string;
    key: string;
    markers: google.maps.Marker[];
    locations: ILocation[];
    infoWindows: any[];
}

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
    google;
    map: google.maps.Map;
    relatedMap: { [key: string]: any };
    typesMap = {};
    typesList: IType[] = [];
    typesSelectOptions: IType[] = [];
    markerActive: number;
    markers: google.maps.Marker[] = [];
    infoWindows: google.maps.InfoWindow[] = [];

    @Input()
    lat: string;
    @Input()
    lng: string;
    @Input()
    height = 100;
    @Input()
    title: string;

    _related: IRelated[];

    @Output()
    relatedChange = new EventEmitter<IRelated[]>();

    @Input()
    public get related(): IRelated[] {
        return this._related;
    }
    public set related(value: IRelated[]) {
        if (!value) return;
        this._related = value;
        this.relatedChange.emit(this._related);
    }

    @ViewChild('mapContainer', { static: false })
    gmap: ElementRef;

    constructor(
        private _mapsService: MapsService,
        private _element: ElementRef
    ) {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            !(
                changes.lat &&
                changes.lat.currentValue &&
                changes.lng &&
                changes.lng.currentValue
            ) &&
            !(changes.related && changes.related.currentValue)
        ) {
            return;
        }

        this.setupMap().then(() => {
            if (
                changes.lat &&
                changes.lat.currentValue &&
                changes.lng &&
                changes.lng.currentValue &&
                changes.title &&
                changes.title.currentValue &&
                (!this._related || !this._related.length)
            ) {
                const selfExploreMarker = {
                    lat: this.lat,
                    lng: this.lng,
                    title: this.title,
                };

                this.setupMarker(selfExploreMarker);
            }

            if (changes.related && changes.related.currentValue) {
                this.relatedMap = changes.related.currentValue.reduce(
                    (relatedMap, related) => {
                        relatedMap = {
                            ...relatedMap,
                            [related.name]: {
                                locations: related.related_objects,
                                markers: [],
                                infoWindows: [],
                            },
                        };

                        return relatedMap;
                    },
                    {}
                );
            }
        });
    }

    async setupMap() {
        this.relatedMap = {};
        this.typesMap = {};
        this.typesList = [];
        this.typesSelectOptions = [];
        this.markers = [];
        this.markerActive = null;
        this.infoWindows = [];
        const styledMapType = [
            {
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#f5f5f5',
                    },
                ],
            },
            {
                elementType: 'labels.icon',
                stylers: [
                    {
                        visibility: 'off',
                    },
                ],
            },
            {
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#616161',
                    },
                ],
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [
                    {
                        color: '#f5f5f5',
                    },
                ],
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#bdbdbd',
                    },
                ],
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#eeeeee',
                    },
                ],
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#757575',
                    },
                ],
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#cadaca',
                    },
                ],
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#9e9e9e',
                    },
                ],
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#ffffff',
                    },
                ],
            },
            {
                featureType: 'road.arterial',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#757575',
                    },
                ],
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#dadada',
                    },
                ],
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#616161',
                    },
                ],
            },
            {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#9e9e9e',
                    },
                ],
            },
            {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#e5e5e5',
                    },
                ],
            },
            {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#eeeeee',
                    },
                ],
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [
                    {
                        color: '#d2e6e8',
                    },
                ],
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [
                    {
                        color: '#9e9e9e',
                    },
                ],
            },
        ] as google.maps.MapOptions['styles'];

        this.google = await this._mapsService.getGoogleMaps();

        let lat =
            this.lat ||
            (this._related &&
                this._related[0] &&
                this._related[0].related_objects &&
                this._related[0].related_objects[0] &&
                this._related[0].related_objects[0].lat);
        let lng =
            this.lng ||
            (this._related &&
                this._related[0] &&
                this._related[0].related_objects &&
                this._related[0].related_objects[0] &&
                this._related[0].related_objects[0].lng);

        const geocoder = new this.google.maps.Geocoder();

        geocoder.geocode({ address: this._related[0].related_objects[0].address }, (results, status) => {
            if (status == this.google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();

                this.map = new this.google.maps.Map(this.gmap.nativeElement, {
                    center: new this.google.maps.LatLng(lat, lng),
                    zoom: 14,
                    styles: styledMapType,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: this.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    },
                });

                this._related[0].related_objects[0].lat = lat;
                this._related[0].related_objects[0].lng = lng;

                this.setUpLocations();

            } else {
                alert(
                   `Ocorreu um erro: ${status}`
                );
            }
        });
    }

    /**
     * cria icone da localização e marca no mapa
     * @param location: ILocation
     */
    setupMarker(location: ILocation) {
        const svgIcon = {
            path:
                'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: 'red',
            fillOpacity: 0.9,
            scale: 0.8,
            strokeWeight: 0,
        };

        const mrkr = new this.google.maps.Marker({
            position: new this.google.maps.LatLng(
                Number(location.lat),
                Number(location.lng)
            ),
            label: {
                text: location.title,
                fontSize: '1.6rem',
                fontWeight: 'bold',
                color: '#646770',
                fontFamily: `'PlantinMTPro', 'Times New Roman', 'Times', 'Baskerville', 'Georgia', serif`,
            },
            map: this.map,
            icon: svgIcon,
        });

        this.markers = [...this.markers, mrkr];

        return mrkr;
    }

    /**
     * adiciona as informações da previsão do tempo em um balão
     * @param location: ILocation
     * @param marker: google.maps.Marker
     */
    setUpInfoWindow(location: ILocation, marker: google.maps.Marker) {
        const data = Object.keys(location.weather);
        const infowindow = new google.maps.InfoWindow({
            content: `
            <div class="info_window_container">

                <div class="row">
                    <div class="col-md-12">
                        <h4>${location.title}</h4>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <h4>${location.description}</h4>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <h5>Previsão do Tempo:</h5>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                    ${data[0]}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <label>Temperatura Mínima</label> <span style="color: blue">${location.weather[data[0]].manha.temp_max}°C</span>
                    </div>
                    <div class="col-md-3">
                        <label>Temperatura Mínima</label> <span style="color: red">${location.weather[data[0]].manha.temp_min}°C</span>
                    </div>
                    <div class="col-md-3">
                        <label>Umidade Máxima</label> <span style="color: red">${location.weather[data[0]].manha.umidade_max}%</span>
                    </div>
                    <div class="col-md-3">
                        <label>Umidade Mínima</label> <span style="color: red">${location.weather[data[0]].manha.umidade_min}%</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        Manhã
                    </div>
                    <div class="col-md-4">
                        Tarde
                    </div>
                    <div class="col-md-4">
                        Noite
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <img src=" ${location.weather[data[0]].manha.icone}" />
                    </div>
                    <div class="col-md-4">
                        <img src=" ${location.weather[data[0]].tarde.icone}" />
                    </div>
                    <div class="col-md-4">
                        <img src=" ${location.weather[data[0]].noite.icone}" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        :: ${location.weather[data[0]].manha.resumo}
                    </div>
                    <div class="col-md-4">
                        :: ${location.weather[data[0]].tarde.resumo}
                    </div>
                    <div class="col-md-4">
                        :: ${location.weather[data[0]].noite.resumo}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        Direção do Vento: ${location.weather[data[0]].manha.dir_vento}
                        Intensidade do Vento: ${location.weather[data[0]].manha.int_vento}
                    </div>
                    <div class="col-md-4">
                        Direção do Vento: ${location.weather[data[0]].tarde.dir_vento}
                        Intensidade do Vento: ${location.weather[data[0]].tarde.int_vento}
                    </div>
                    <div class="col-md-4">
                        Direção do Vento: ${location.weather[data[0]].noite.dir_vento}
                        Intensidade do Vento: ${location.weather[data[0]].noite.int_vento}
                    </div>
                </div>
              <p></p>
            </div>
          `,
        });

        this.infoWindows = [...this.infoWindows, infowindow];

        marker.addListener('click', () => {
            this.infoWindows.forEach((infoWindow) => infoWindow.close());
            infowindow.open(this.map, marker);
            this.markerActive = location.id;
            const element = this._element.nativeElement.getElementsByClassName(
                String(location.id)
            )[0];

            if (element) {
                element.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
        });

        return infowindow;
    }

    // seta a localização no mapa
    setUpLocations() {
        Object.keys(this.relatedMap).forEach((key) => {
            const locations = this.relatedMap[key].locations;

            locations.forEach((location) => {
                const marker = this.setupMarker(location);
                let infoWindow;
                this.relatedMap[key].markers = [
                    ...this.relatedMap[key].markers,
                    marker,
                ];

                if (location.description) {
                    infoWindow = this.setUpInfoWindow(location, marker);

                    this.relatedMap[key].infoWindows = [
                        ...this.relatedMap[key].infoWindows,
                        infoWindow,
                    ];
                }

                if (this.typesMap[location.type_slug]) {
                    this.typesMap[location.type_slug].markers = [
                        ...this.typesMap[location.type_slug].markers,
                        marker,
                    ];
                    this.typesMap[location.type_slug].locations = [
                        ...this.typesMap[location.type_slug].locations,
                        location,
                    ];
                    if (infoWindow) {
                        this.typesMap[location.type_slug].infoWindows = [
                            ...this.typesMap[location.type_slug].infoWindows,
                            infoWindow,
                        ];
                    }
                } else {
                    this.typesMap[location.type_slug] = {
                        title: location.type,
                        key: location.type_slug,
                        markers: [marker],
                        locations: [location],
                        infoWindows: infoWindow ? [infoWindow] : [],
                    };
                }
            });
        });

        this.typesList = Object.keys(this.typesMap).map(
            (key) => this.typesMap[key]
        );
        this.typesSelectOptions = [...this.typesList];
    }
}
