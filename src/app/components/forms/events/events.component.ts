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
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService
  ) {
    this.eventForm = this.fb.group({
      label: ['', Validators.required],
      description: [''],
      date: [null, Validators.required],
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
      this.eventForm.patchValue(this.event);
    }
  }

  private loadArtists() {
    this.artistService.getAll().subscribe(artists => {
      this.artists = artists;
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.submitForm.emit(this.eventForm.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 