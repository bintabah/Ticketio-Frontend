import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist.model';
import { BaseEntityService } from './base-entity.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistService extends BaseEntityService<Artist> {
  protected apiUrl = '/api/artists';

  constructor(http: HttpClient) {
    super(http);
  }

  getArtists(): Observable<Artist[]> {
    return this.getAll();
  }

  getArtist(id: number): Observable<Artist> {
    return this.getById(id);
  }

  createArtist(artist: Artist): Observable<Artist> {
    return this.create(artist);
  }

  updateArtist(id: number, artist: Artist): Observable<Artist> {
    return this.update(id, artist);
  }

  deleteArtist(id: number): Observable<void> {
    return this.delete(id);
  }
  
  // deleteArtist(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}
