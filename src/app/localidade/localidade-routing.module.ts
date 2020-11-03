import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalidadeComponent } from './localidade.component';

const routes: Routes = [
    { path: '', component: LocalidadeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalidadeRoutingModule { }
