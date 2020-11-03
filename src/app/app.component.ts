import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Teste Frontend Wolk';

    /**
     * Adicione itens nesse array para popular o Menu
     * A Url deve coincidir com o caminho do componente em app.route.ts
     */
    public nav_items = [
        {
            icon: 'dashboard',
            label: 'Localidades',
            url: '/',
        },
    ];
}
