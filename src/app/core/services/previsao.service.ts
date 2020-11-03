import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { RequestMethod, Resource } from '@uex/web-extensions';
import { environment } from './../../../environments/environment';

@Injectable()
export class PrevisaoService extends BaseService {
    public url = `${environment.INMET_API_URL}/previsao`;

    public getWeather(idCounty: number) {
        return this.buildResource({
            method: RequestMethod.Get,
            path: `/${idCounty}`,
        });
    }
}
