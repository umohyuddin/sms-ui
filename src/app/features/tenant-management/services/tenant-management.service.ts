import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class TenantManagementService {

  constructor(private httpClientService: HttpClientService
  ) { }
}
