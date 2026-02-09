import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../../components/navbar/navbar';
import { IncidentStatusHistory } from '../../../models/incident-status-history.model';
import { IncidentStatus } from '../../../models/enums/incident-status.enum';
import { IncidentType } from '../../../models/enums/incident-type.enum';
import { ModerationService } from '../../../services/moderation.service';
import { IncidentService } from '../../../services/incident.service';
import { Incident } from '../../../models/incident.model';

@Component({
  selector: 'app-history-component',
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './incident-status-history-component.html',
  styleUrl: './incident-status-history-component.css',
})
export class IncidentStatusHistoryComponent implements OnInit {
  historyRecords: IncidentStatusHistory[] = [];
  filteredHistory: IncidentStatusHistory[] = [];
  selectedHistory: IncidentStatusHistory | null = null;
  showDetailDialog = false;
  searchTerm = '';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pagedHistory: IncidentStatusHistory[] = [];
  pagesArray: number[] = [];

  selectedStatusFilter: IncidentStatus | null = null;
  incidentStatuses = Object.values(IncidentStatus);

  showDeleteConfirmDialog = false;
  historyToDelete: IncidentStatusHistory | null = null;

  showSuccessDialog = false;
  successMessage = '';

  relatedIncident: Incident | null = null;

  constructor(
    private moderationService: ModerationService,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.moderationService.getAll().subscribe({
      next: (history) => {
        this.historyRecords = history.sort((a, b) => {
          const dateA = new Date(a.statusChangeTime || 0).getTime();
          const dateB = new Date(b.statusChangeTime || 0).getTime();
          return dateB - dateA; // Najnoviji prvo
        });
        this.applyFilter();
      },
      error: (err) => {
        console.error('Failed to load history', err);
      }
    });
  }

  getStatusLabel(status: IncidentStatus): string {
    const labels: Record<string, string> = {
      [IncidentStatus.REPORTED]: 'Reported',
      [IncidentStatus.PENDING]: 'Pending',
      [IncidentStatus.APPROVED]: 'Approved',
      [IncidentStatus.REJECTED]: 'Rejected',
      [IncidentStatus.RESOLVED]: 'Resolved',
      [IncidentStatus.DUPLICATE]: 'Duplicate',
      [IncidentStatus.CANCELED]: 'Canceled',
    };
    return labels[status];
  }

  getIncidentTypeLabel(type: IncidentType): string {
    const labels: Record<string, string> = {
      [IncidentType.FIRE]: 'Fire',
      [IncidentType.FLOOD]: 'Flood',
      [IncidentType.ACCIDENT]: 'Accident',
      [IncidentType.CRIME]: 'Crime',
    };
    return labels[type];
  }

  getStatusBadgeClass(status: IncidentStatus): string {
    const map: Record<string, string> = {
      [IncidentStatus.REPORTED]: 'bg-primary bg-opacity-10 text-primary',
      [IncidentStatus.PENDING]: 'bg-warning bg-opacity-10 text-warning',
      [IncidentStatus.APPROVED]: 'bg-success bg-opacity-10 text-success',
      [IncidentStatus.REJECTED]: 'bg-danger bg-opacity-10 text-danger',
      [IncidentStatus.RESOLVED]: 'bg-secondary bg-opacity-10 text-secondary',
      [IncidentStatus.DUPLICATE]: 'bg-info bg-opacity-10 text-info',
      [IncidentStatus.CANCELED]: 'bg-dark bg-opacity-10 text-dark',
    };
    return map[status];
  }

  getTypeBadgeClass(type: IncidentType): string {
    const map: Record<string, string> = {
      [IncidentType.FIRE]: 'bg-danger bg-opacity-10 text-danger',
      [IncidentType.FLOOD]: 'bg-info bg-opacity-10 text-info',
      [IncidentType.ACCIDENT]: 'bg-warning bg-opacity-10 text-warning',
      [IncidentType.CRIME]: 'bg-dark bg-opacity-10 text-dark',
    };
    return map[type];
  }

  applyFilter(): void {
    let filtered = [...this.historyRecords];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.incidentId?.toString().includes(term) ||
          h.id?.toString().includes(term) ||
          this.getStatusLabel(h.status).toLowerCase().includes(term)
      );
    }

    if (this.selectedStatusFilter) {
      filtered = filtered.filter((h) => h.status === this.selectedStatusFilter);
    }

    this.filteredHistory = filtered;
    this.totalPages = Math.ceil(this.filteredHistory.length / this.pageSize) || 1;
    this.currentPage = 1;
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePagedHistory();
  }

  setStatusFilter(status: IncidentStatus | null): void {
    this.selectedStatusFilter = status;
    this.applyFilter();
  }

  updatePagedHistory(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedHistory = this.filteredHistory.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedHistory();
  }

  openDetail(history: IncidentStatusHistory): void {
    this.selectedHistory = { ...history };
    this.showDetailDialog = true;

    if (history.incidentId) {
      this.incidentService.getIncidentById(history.incidentId).subscribe({
        next: (incident) => {
          this.relatedIncident = incident;
        },
        error: (err) => {
          console.error('Failed to load related incident', err);
          this.relatedIncident = null;
        }
      });
    }
  }

  closeDetail(): void {
    this.showDetailDialog = false;
    this.selectedHistory = null;
    this.relatedIncident = null;
  }

  confirmDelete(history: IncidentStatusHistory): void {
    this.historyToDelete = history;
    this.showDeleteConfirmDialog = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirmDialog = false;
    this.historyToDelete = null;
  }

  deleteHistory(): void {
    if (!this.historyToDelete?.id) return;

    this.moderationService.delete(this.historyToDelete.id).subscribe({
      next: () => {
        this.historyRecords = this.historyRecords.filter(
          (h) => h.id !== this.historyToDelete!.id
        );
        this.applyFilter();
        this.closeDeleteConfirm();
        this.successMessage = 'History Record Deleted Successfully';
        this.showSuccessDialog = true;
      },
      error: (err) => {
        console.error('Failed to delete history', err);
        alert('Failed to delete: ' + (err.error?.message || err.message));
        this.closeDeleteConfirm();
      }
    });
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog = false;
    this.successMessage = '';
  }
}
