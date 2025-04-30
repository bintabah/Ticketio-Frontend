import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

interface TopEvent {
  name: string;
  date: Date;
  location: string;
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

  ngOnInit() {
    // Simulated data - replace with actual API calls
    this.totalSales = 4560;
    this.salesGrowth = 12;
    this.totalTickets = 1250;
    this.totalUsers = 845;
    this.totalEvents = 32;
    
    this.topEvents = [
      {
        name: 'Summer Festival 2024',
        date: new Date('2024-07-15'),
        location: 'Central Park',
        ticketsSold: 450,
        revenue: 22500
      },
      {
        name: 'Rock Concert',
        date: new Date('2024-06-20'),
        location: 'Stadium Arena',
        ticketsSold: 380,
        revenue: 19000
      },
      {
        name: 'Jazz Night',
        date: new Date('2024-05-30'),
        location: 'Music Hall',
        ticketsSold: 280,
        revenue: 14000
      },
      {
        name: 'Classical Symphony',
        date: new Date('2024-06-05'),
        location: 'Opera House',
        ticketsSold: 250,
        revenue: 12500
      },
      {
        name: 'Dance Festival',
        date: new Date('2024-07-01'),
        location: 'City Square',
        ticketsSold: 220,
        revenue: 11000
      }
    ];
  }
} 