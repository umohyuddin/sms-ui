import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private http: HttpClient
  ) { }

  request<T>(method: string, url: string, options?: {
    body?: any;
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    responseType?: 'json';
    withCredentials?: boolean;
    observeResponse?: boolean;
  }): Observable<T | HttpResponse<T>> {

     if (options?.observeResponse) {
      //   tell TS this will be HttpResponse<T>
      return this.http.request<T>(method, url, { ...options, observe: 'response' }) as Observable<HttpResponse<T>>;
    }

    return this.http.request<T>(method, url, options);
  }
}
