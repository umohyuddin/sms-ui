import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { HttpClientService } from '../../../../core/services/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';

describe('CampusCreateFormComponent', () => {
  
});
