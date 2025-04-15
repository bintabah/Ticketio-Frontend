import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  
  private apiUrl = '/api/artists';

  constructor(private http: HttpClient) {}

  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.apiUrl);
  }
}
