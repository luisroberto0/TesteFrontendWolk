import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalidadeService } from './services/localidade.service';
import { PrevisaoService } from './services/previsao.service';

@NgModule({
    imports: [CommonModule],
    providers: [LocalidadeService, PrevisaoService],
})
export class CoreModule {}
