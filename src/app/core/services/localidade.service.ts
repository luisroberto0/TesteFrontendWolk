import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { RequestMethod, Resource } from '@uex/web-extensions';
import { environment } from './../../../environments/environment';

@Injectable()
export class LocalidadeService extends BaseService {
    public url = `${environment.IBGE_API_URL}/localidades`;

    public getStates: Resource = this.buildResource({
        method: RequestMethod.Get,
        path: `/estados`,
    });

    public getMicroregionsByIdState(idState: number) {
        return this.buildResource({
            method: RequestMethod.Get,
            path: `/estados/${idState}/microrregioes`,
        });
    }
}
