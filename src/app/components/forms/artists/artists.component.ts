import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Artist } from '../../../models/artist.model';
import { ArtistService } from '../../../services/artist.service';

@Component({
  selector: 'app-artists-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsFormComponent implements OnChanges {
  @Input() artist: Artist | null = null;
  @Output() submitForm = new EventEmitter<Artist>();
  @Output() cancel = new EventEmitter<void>();

  artistForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder, private artistService: ArtistService) {
    this.artistForm = this.fb.group({
      name: ['', Validators.required],
      genre: ['', Validators.required]
    });
  }

  ngOnChanges() {
    if (this.artist) {
      this.isEditMode = true;
      this.artistForm.patchValue({
        name: this.artist.name,
        genre: this.artist.genre
      });
    } else {
      this.isEditMode = false;
      this.artistForm.reset();
    }
  }

  onSubmit() {
    if (this.artistForm.valid) {
      const formData = this.artistForm.value;
      if (this.isEditMode && this.artist) {
        formData.artistId = this.artist.artistId;
      }
      this.submitForm.emit(formData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 