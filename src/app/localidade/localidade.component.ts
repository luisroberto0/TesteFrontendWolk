import { Component, OnInit } from '@angular/core';
import { FormService } from '@uex/web-extensions';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LocalidadeService } from './../core/services/localidade.service';

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

    related = [
        {
            name: 'default',
            related_objects: [
                {
                    id: 801,
                    type: 'Nightlife',
                    type_slug: 'nightlife',
                    title: 'Cutitiba',
                    description: 'Parei no teste por aqui, pois precisava habilitar faturamento do google maps para usar geocode',
                    lng: -49.2733,
                    lat: -25.4284,
                    address: 'Curitiba, PR',
                    content_type: 'place',
                    alias: '',
                },
            ],
        },
    ];

    constructor(
        private localidadeService: LocalidadeService,
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
    }

    getStates() {
        this.localidadeService.getStates().then((res) => {
            this.statesList = res.data;
            console.log(res);
        });
    }

    getMicroregionsByIdState(idState: number) {
        this.localidadeService
            .getMicroregionsByIdState(idState)()
            .then((res) => {
                this.microregionsList = res.data;
                this.filteredItems = res.data;
                console.log(res);
            });
    }

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

    // Filtrar itens com base no valor da propriedade do nome do item
    onFilterSearch(value: string) {
        this.filteredItems = this.microregionsList.filter(
            (_) => _['nome'] && _['nome'].toLowerCase().startsWith(value)
        );
    }

    clickEventHandler(item: any) {
    }
}
