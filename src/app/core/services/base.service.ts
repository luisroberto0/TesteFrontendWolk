import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResourceParams, RequestParams } from '@uex/web-extensions';
import { BaseModel } from '@uex/web-extensions';
import { ToastService } from '@uex/web-extensions';
import { environment } from './../../../environments/environment';

@Injectable()
export abstract class BaseService extends BaseModel {
    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService);
    }

    public url: string;
    public path: string;
    public timeout = 60000;

    public headerInterceptor(
        headers: any,
        resource_params: ResourceParams,
        request_params: RequestParams
    ): HttpHeaders {
        return headers;
    }
}

export { Resource } from '@uex/web-extensions';
