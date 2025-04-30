import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Event } from '../../../models/event.model';
import { Artist } from '../../../models/artist.model';
import { ArtistService } from '../../../services/artist.service';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-events-form',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    ButtonModule
  ]
})
export class EventsFormComponent implements OnInit {
  @Input() event?: Event;
  @Output() submitForm = new EventEmitter<Event>();
  @Output() cancel = new EventEmitter<void>();

  get isEditMode(): boolean {
    return !!this.event;
  }

  eventForm: FormGroup;
  artists: Artist[] = [];
  selectedArtist: Artist | null = null;
  statusOptions = [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Closed', value: 'CLOSED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService
  ) {
    this.eventForm = this.fb.group({
      eventId: [null],
      label: ['', Validators.required],
      description: [''],
      date: [new Date(), Validators.required],
      place: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      capacity: [0, [Validators.required, Validators.min(1)]],
      status: ['ACTIVE', Validators.required],
      popularity: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      artist: [null]
    });
  }

  ngOnInit() {
    this.loadArtists().then(() => {
      if (this.event) {
        const eventData = {
          ...this.event,
          date: typeof this.event.date === 'string' ? new Date(this.event.date) : this.event.date,
          price: Number(this.event.price),
          capacity: Number(this.event.capacity),
          popularity: Number(this.event.popularity)
        };
        this.eventForm.patchValue(eventData);
        
        // Set selected artist if it exists
        if (this.event.artist) {
          this.selectedArtist = this.event.artist;
          const artistControl = this.eventForm.get('artist');
          if (artistControl) {
            artistControl.setValue(this.event.artist);
          }
        }
      }
    });
  }

  private async loadArtists(): Promise<void> {
    return new Promise((resolve) => {
      this.artistService.getAll().subscribe(artists => {
        this.artists = artists;
        resolve();
      });
    });
  }

  onArtistSelect(event: { value: Artist }): void {
    if (event.value) {
      this.selectedArtist = event.value;
    } else {
      this.selectedArtist = null;
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      
      const eventData: Event = {
        label: formValue.label,
        description: formValue.description,
        date: formValue.date instanceof Date ? formValue.date.toISOString() : formValue.date,
        place: formValue.place,
        price: Number(formValue.price),
        capacity: Number(formValue.capacity),
        status: formValue.status,
        popularity: Number(formValue.popularity),
        artist: this.selectedArtist ? {
          artistId: this.selectedArtist.artistId
        } as Artist : null
      };

      if (this.event?.eventId) {
        eventData.eventId = this.event.eventId;
      }

      this.submitForm.emit(eventData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}