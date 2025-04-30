import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Event } from '../../../models/event.model';
import { Artist } from '../../../models/artist.model';
import { ArtistService } from '../../../services/artist.service';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-events-form',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    InputTextarea,
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
      popularity: [0, [Validators.required, Validators.min(0)]],
      artist: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadArtists();
    if (this.event) {
      // Convert string date to Date object if needed
      const eventData = {
        ...this.event,
        date: this.event.date instanceof Date ? this.event.date : new Date(this.event.date),
        price: Number(this.event.price),
        capacity: Number(this.event.capacity),
        popularity: Number(this.event.popularity),
        // Create proper artist object structure
        artist: this.event.artist
      };
      this.eventForm.patchValue(eventData);
    }
  }

  private loadArtists() {
    this.artistService.getAll().subscribe(artists => {
      this.artists = artists;
      // If we have an event with an artist, ensure the artist is in the list
      if (this.event?.artist && !this.artists.some(a => a.artistId === this.event?.artist?.artistId)) {
        this.artists.push(this.event.artist);
      }
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      
      // Ensure proper types for the backend
      const eventData: Event = {
        ...formValue,
        eventId: this.event?.eventId || null,
        price: Number(formValue.price),
        capacity: Number(formValue.capacity),
        popularity: Number(formValue.popularity),
        // Convert to proper format expected by Java Date
        date: formValue.date instanceof Date ? formValue.date.toISOString() : formValue.date,
        // Create proper artist object structure
        artist: this.artists.find(a => a.artistId === formValue.artist) || null
      };

      this.submitForm.emit(eventData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 