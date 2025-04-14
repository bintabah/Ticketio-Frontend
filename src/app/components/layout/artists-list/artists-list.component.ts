import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistService } from '../../../services/artist.service';
import { Artist } from '../../../models/artist.model';
import { TableModule } from 'primeng/table';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-artists-list',
  standalone: true,
  imports: [CommonModule, TableModule, FooterComponent],
  templateUrl: './artists-list.component.html',
  styleUrl: './artists-list.component.css'
})
export class ArtistsListComponent implements OnInit {
  artists: Artist[] = [];
  private artistService = inject(ArtistService);

  ngOnInit(): void {
    this.artistService.getArtists().subscribe(
      (data: Artist[]) => {
        console.log('Artistes récupérés :', data);
        this.artists = data;
      },
      (error: Error) => {
        console.error('Erreur lors de la récupération des artistes', error);
      }
    );
  }
}
