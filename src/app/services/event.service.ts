import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { BaseEntityService } from './base-entity.service';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseEntityService<Event> {
  protected apiUrl = '/api/events';

  constructor(http: HttpClient) {
    super(http);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 