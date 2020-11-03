import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalidadeComponent } from './localidade.component';
import {
    CardModule,
    IconModule,
    ListModule,
    GridModule,
    TemplateModule,
    ButtonModule,
    FormModule,
} from '@uex/web-extensions';
import { LocalidadeRoutingModule } from './localidade-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapModule } from '../core/components/map/map.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        TemplateModule,
        CardModule,
        IconModule,
        ListModule,
        GridModule,
        ButtonModule,
        FormModule,
        MapModule,

        NgMultiSelectDropDownModule.forRoot(),

        LocalidadeRoutingModule,
    ],
    declarations: [LocalidadeComponent],
})
export class LocalidadeModule {}
