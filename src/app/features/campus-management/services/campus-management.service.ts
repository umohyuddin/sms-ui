import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class CampusManagementService {

  constructor(private httpClientService: HttpClientService
  ) { }
}
