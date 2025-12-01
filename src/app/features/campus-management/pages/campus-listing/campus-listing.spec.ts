import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CampusListing } from './Campus-listing';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Campus } from '../../models/Campus';

describe('CampusListing', () => {});
