import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalidadeService } from './services/localidade.service';

@NgModule({
    imports: [CommonModule],
    providers: [LocalidadeService],
})
export class CoreModule {}
