import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Event } from '../../../models/event.model';
import { Artist } from '../../../models/artist.model';
import { ArtistService } from '../../../services/artist.service';
import { CalendarModule } from 'primeng/calendar';
import { SelectModule } from 'primeng/select';
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
    FormsModule,
    CalendarModule,
    SelectModule,
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
      popularity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (this.event) {
      const eventData = {
        ...this.event,
        date: this.event.date instanceof Date ? this.event.date : new Date(this.event.date),
        price: Number(this.event.price),
        capacity: Number(this.event.capacity),
        popularity: Number(this.event.popularity),
        artist: this.event.artist?.artistId
      };
      this.eventForm.patchValue(eventData);
      this.selectedArtist = this.event.artist;
    }
    this.loadArtists();
  }

  private loadArtists() {
    this.artistService.getAll().subscribe(artists => {
      this.artists = artists;
      if (this.event?.artist) {
        const existingArtist = this.artists.find(a => a.artistId === this.event?.artist?.artistId);
        if (!existingArtist) {
          this.artists = [...this.artists, this.event.artist];
        }
        this.selectedArtist = existingArtist || this.event.artist;
      }
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      
      const eventData: Event = {
        ...formValue,
        eventId: this.event?.eventId || null,
        price: Number(formValue.price),
        capacity: Number(formValue.capacity),
        popularity: Number(formValue.popularity),
        date: formValue.date instanceof Date ? formValue.date.toISOString() : formValue.date,
        artist: this.artists.find(a => a.artistId === formValue.artist) || null
      };

      this.submitForm.emit(eventData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 