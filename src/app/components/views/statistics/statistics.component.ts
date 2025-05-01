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
    this.totalUsers = 0;
    this.totalEvents = 0;
    
    this.topEvents = [];
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