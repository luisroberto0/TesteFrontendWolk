import { Component, OnInit } from '@angular/core';
import { FormService } from '@uex/web-extensions';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LocalidadeService } from './../core/services/localidade.service';
import { PrevisaoService } from './../core/services/previsao.service';

@Component({
    selector: 'app-localidade',
    templateUrl: './localidade.component.html',
    styleUrls: ['./localidade.component.scss'],
})
export class LocalidadeComponent implements OnInit {

    public microregionsList: Array<any>;
    public statesList: Array<any> = [];
    public selectedStates;
    public filteredItems: any[] = [];

    dropdownSettings: IDropdownSettings;

    related = [];

    constructor(
        private localidadeService: LocalidadeService,
        private previsaoTempo: PrevisaoService,
        private _formService: FormService
    ) {}

    public form = this._formService.create([
        {
            type: 'text',
            key: 'basic_cidade',
            label: 'Cidade',
            grid: {
                cols: 2,
            },
            events: {
                onKeyup: (event) => this.onFilterSearch(event.schema.value),
            },
        },
    ]);

    ngOnInit() {
        this.setConfigDropdown();
        this.getStates();
        this.getMicroregionsByIdState(41);
        this.setWeather(4106902, 'Curitiba', `Curitiba, PR`);
    }

    // busca de estados
    private getStates() {
        this.localidadeService.getStates().then((res) => {
            this.statesList = res.data;
            console.log(res);
        });
    }

    /**
     * busca microrregions a partir do id do estado
     * @param idState: number
     */
    private getMicroregionsByIdState(idState: number) {
        this.localidadeService
            .getMicroregionsByIdState(idState)()
            .then((res) => {
                this.microregionsList = res.data;
                this.filteredItems = res.data;
                console.log(res);
            });
    }

    // configuração do dropdown
    private setConfigDropdown() {
        this.dropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'nome',
            enableCheckAll: false,
            itemsShowLimit: 1,
            allowSearchFilter: true,
            searchPlaceholderText: 'Pesquisar',
            closeDropDownOnSelection: true
        };
    }

    /**
     * Filtrar itens com base no valor da propriedade do nome do item
     * @param value: string
     */
    onFilterSearch(value: string) {
        this.filteredItems = this.microregionsList.filter(
            (_) => _['nome'] && _['nome'].toLowerCase().startsWith(value)
        );
    }

    /**
     * click da lista de cidades
     * @param item: any
     */
    clickEventHandler(item: any) {
        this.localidadeService.getCountyByIdMicroregions(item.id)().then(county => {
            county.data.map( county => {
                if (county.nome === item.nome) {
                    this.setWeather(county.id, item.nome, `${item.nome}, ${item.mesorregiao.UF.sigla}`);
                }
            });
        });
    }

    /**
     * busca as previsões a partir do id do municipio
     * @param id: number
     * @param title: string
     * @param address: string
     */
    private setWeather(id: number, title: string, address: string) {
        this.previsaoTempo.getWeather(id)().then(weather => {
            console.log(weather);
            const keysweather = Object.keys(weather.data);
            this.related = [
                {
                    name: 'default',
                    related_objects: [
                        {
                            id: 1,
                            type: 'Nightlife',
                            type_slug: 'nightlife',
                            title: title,
                            description: 'Previsões meteorológicas para os próximos dias',
                            lng: null,
                            lat: null,
                            address: address,
                            content_type: 'place',
                            alias: '',
                            weather: weather.data[keysweather[0]]
                        },
                    ],
                },
            ];
        });
    }
}
