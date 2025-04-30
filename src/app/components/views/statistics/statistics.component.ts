import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { StatisticsService } from '../../../services/statistics.service';

interface TopEvent {
  eventId: number;
  label: string;
  date: Date;
  place: string;
  price: number;
  ticketsSold: number;
  revenue: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ChartModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  totalSales: number = 0;
  salesGrowth: number = 0;
  totalTickets: number = 0;
  totalUsers: number = 0;
  totalEvents: number = 0;
  topEvents: TopEvent[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.loadStatistics();
    // Simulated data - replace with actual API calls
    this.totalUsers = 845;
    this.totalEvents = 32;
    
    this.topEvents = [
      {
        eventId: 1,
        label: 'Summer Festival 2024',
        date: new Date('2024-07-15'),
        place: 'Central Park',
        price: 50,
        ticketsSold: 450,
        revenue: 22500
      },
      {
        eventId: 2,
        label: 'Rock Concert',
        date: new Date('2024-06-20'),
        place: 'Stadium Arena',
        price: 50,
        ticketsSold: 380,
        revenue: 19000
      },
      {
        eventId: 3,
        label: 'Jazz Night',
        date: new Date('2024-05-30'),
        place: 'Music Hall',
        price: 50,
        ticketsSold: 280,
        revenue: 14000
      },
      {
        eventId: 4,
        label: 'Classical Symphony',
        date: new Date('2024-06-05'),
        place: 'Opera House',
        price: 50,
        ticketsSold: 250,
        revenue: 12500
      },
      {
        eventId: 5,
        label: 'Dance Festival',
        date: new Date('2024-07-01'),
        place: 'City Square',
        price: 50,
        ticketsSold: 220,
        revenue: 11000
      }
    ];
  }

  private loadStatistics() {
    this.statisticsService.getTotalSales().subscribe({
      next: (total) => {
        this.totalSales = total;
      },
      error: (error) => {
        console.error('Error loading total sales:', error);
      }
    });

    this.statisticsService.getTotalTickets().subscribe({
      next: (total) => {
        this.totalTickets = total;
      },
      error: (error) => {
        console.error('Error loading total tickets:', error);
      }
    });

    this.statisticsService.getTotalUsers().subscribe({
      next: (total) => {
        this.totalUsers = total;
      },
      error: (error) => {
        console.error('Error loading total users:', error);
      }
    });

    this.statisticsService.getTotalEvents().subscribe({
      next: (total) => {
        this.totalEvents = total;
      },
      error: (error) => {
        console.error('Error loading total events:', error);
      }
    });

    this.statisticsService.getTopEvents().subscribe({
      next: (events) => {
        this.topEvents = events;
      },
      error: (error) => {
        console.error('Error loading top events:', error);
      }
    });
  }
} 