import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as L from 'leaflet';
import { Navbar } from '../../../components/navbar/navbar';
import { Incident } from '../../../models/incident.model';
import { IncidentStatus } from '../../../models/enums/incident-status.enum';
import { IncidentType } from '../../../models/enums/incident-type.enum';
import { IncidentSubtype } from '../../../models/enums/incident-subtype.enum';
import { IncidentService } from '../../../services/incident.service';
import {ModerationService} from '../../../services/moderation.service';
import {AuthService, CurrentUser} from '../../../auth/auth.service';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './moderation-component.html',
  styleUrls: ['./moderation-component.css'],
})
export class ModerationComponent implements OnInit {
  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];
  selectedIncident: Incident | null = null;
  showDetailDialog = false;
  searchTerm = '';

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pagedIncidents: Incident[] = [];
  pagesArray: number[] = [];

  selectedStatusFilter: IncidentStatus | null = null;

  incidentStatuses = Object.values(IncidentStatus);

  showStatusConfirmationDialog = false;
  closeStatusConfirmationDialog(): void {
    this.showStatusConfirmationDialog = false;
  }


  readonly MARKER_ICONS: Record<string, L.DivIcon> = {
    [IncidentType.FIRE]: this.createIcon('#ff4444', '🔥'),
    [IncidentType.FLOOD]: this.createIcon('#4444ff', '💧'),
    [IncidentType.ACCIDENT]: this.createIcon('#ff8800', '🚗'),
    [IncidentType.CRIME]: this.createIcon('#aa0000', '⚠️'),
  };

  currentUser: CurrentUser | null = null;


  constructor(private incidentService: IncidentService, private moderationService: ModerationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadIncidents();
    this.authService.fetchCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  private loadIncidents(): void {
    this.incidentService.getAllIncidents().subscribe((incidents) => {
      this.incidents = incidents;
      this.applyFilter();
    });
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

  getIncidentSubtypeLabel(subtype: IncidentSubtype): string {
    const labels: Record<string, string> = {
      [IncidentSubtype.CAR_ACCIDENT]: 'Car Accident',
      [IncidentSubtype.BUILDING_FIRE]: 'Building Fire',
      [IncidentSubtype.ROBBERY]: 'Robbery',
      [IncidentSubtype.ASSAULT]: 'Assault',
    };
    return labels[subtype];
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
    let filtered = [...this.incidents];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          this.getIncidentTypeLabel(i.type).toLowerCase().includes(term) ||
          (i.subtype && this.getIncidentSubtypeLabel(i.subtype).toLowerCase().includes(term)) ||
          (i.description && i.description.toLowerCase().includes(term)) ||
          (i.id?.toString().includes(term))
      );
    }

    if (this.selectedStatusFilter) {
      filtered = filtered.filter((i) => i.status === this.selectedStatusFilter);
    }

    this.filteredIncidents = filtered;
    this.totalPages = Math.ceil(this.filteredIncidents.length / this.pageSize) || 1;
    this.currentPage = 1;
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePagedIncidents();
  }

  setStatusFilter(status: IncidentStatus | null): void {
    this.selectedStatusFilter = status;
    this.applyFilter();
  }

  updatePagedIncidents(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedIncidents = this.filteredIncidents.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedIncidents();
  }

  openDetail(incident: Incident): void {
    this.selectedIncident = { ...incident };
    this.showDetailDialog = true;
    setTimeout(() => this.initDetailMap(), 0);
  }

  closeDetail(): void {
    this.showDetailDialog = false;
    this.destroyDetailMap();
    this.selectedIncident = null;
  }

  updateStatus(newStatus: IncidentStatus): void {
    if (!this.selectedIncident) {
      console.log('No selected incident');
      return;
    }

    const incidentId = this.selectedIncident.id!;
    const moderatorId = this.currentUser?.id ?? 1;

    this.incidentService.updateIncidentStatus(incidentId, newStatus).subscribe({
      next: (updatedIncident) => {
        this.moderationService.createStatusHistory({
          incidentId: incidentId,
          status: newStatus,
          moderatorId: moderatorId
        }).subscribe();

        const idx = this.incidents.findIndex(i => i.id === incidentId);
        if (idx !== -1) {
          this.incidents[idx] = updatedIncident;
        }

        this.applyFilter();

        if (this.selectedIncident) {
          this.selectedIncident.status = newStatus;
        }

        this.showStatusConfirmationDialog = true;
      },
      error: (err) => {
        console.error('Failed to update incident status', err);
        alert('Failed to update status: ' + (err.error?.message || err.message));
      }
    });
  }

  private initDetailMap(): void {
    const el = document.getElementById('detail-map');
    if (!el || !this.selectedIncident) return;

    this.map = L.map(el, {
      center: [this.selectedIncident.location.latitude, this.selectedIncident.location.longitude],
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.addCustomZoomControl();

    const icon = this.MARKER_ICONS[this.selectedIncident.type];
    this.marker = L.marker(
      [this.selectedIncident.location.latitude, this.selectedIncident.location.longitude],
      { icon }
    ).addTo(this.map);
  }

  private destroyDetailMap(): void {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private addCustomZoomControl(): void {
    if (!this.map) return;
    const map = this.map;

    const zoomControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: () => {
        const container = L.DomUtil.create(
          'div',
          'leaflet-zoom-control bg-white shadow-sm rounded-pill p-1 d-flex flex-column'
        );

        const createBtn = (type: 'in' | 'out') => {
          const btn = L.DomUtil.create(
            'button',
            'btn btn-sm bg-secondary bg-opacity-10 text-dark rounded-pill mb-1 d-flex align-items-center justify-content-center',
            container
          );
          btn.innerHTML =
            type === 'in' ? '<i class="bi bi-zoom-in fs-6"></i>' : '<i class="bi bi-zoom-out fs-6"></i>';
          btn.setAttribute('type', 'button');

          L.DomEvent.on(btn, 'click', L.DomEvent.stop)
            .on(btn, 'click', () => (type === 'in' ? map.zoomIn() : map.zoomOut()))
            .on(btn, 'mousedown', L.DomEvent.stop)
            .on(btn, 'dblclick', L.DomEvent.stop);
        };

        createBtn('in');
        createBtn('out');
        return container;
      },
    });

    map.addControl(new zoomControl());
  }

  private createIcon(color: string, emoji: string): L.DivIcon {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 36px; height: 36px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          transform: rotate(-45deg);
        ">
          <span style="transform: rotate(45deg);">${emoji}</span>
        </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  }

  getAvailableActions(current: IncidentStatus): { status: IncidentStatus; label: string; btnClass: string }[] {
    const all: Record<IncidentStatus, { status: IncidentStatus; label: string; btnClass: string }[]> = {
      [IncidentStatus.REPORTED]: [
        { status: IncidentStatus.PENDING, label: 'Set Pending', btnClass: 'bg-warning bg-opacity-10 text-dark' },
        { status: IncidentStatus.APPROVED, label: 'Approve', btnClass: 'bg-success bg-opacity-25 text-dark' },
        { status: IncidentStatus.REJECTED, label: 'Reject', btnClass: 'bg-danger bg-opacity-10 text-dark' },
        { status: IncidentStatus.DUPLICATE, label: 'Mark Duplicate', btnClass: 'bg-info bg-opacity-10 text-dark' },
      ],
      [IncidentStatus.PENDING]: [
        { status: IncidentStatus.APPROVED, label: 'Approve', btnClass: 'bg-success bg-opacity-25 text-dark' },
        { status: IncidentStatus.REJECTED, label: 'Reject', btnClass: 'bg-danger bg-opacity-10 text-dark' },
        { status: IncidentStatus.DUPLICATE, label: 'Mark Duplicate', btnClass: 'bg-info bg-opacity-10 text-dark' },
        { status: IncidentStatus.CANCELED, label: 'Cancel', btnClass: 'bg-dark bg-opacity-10 text-dark' },
      ],
      [IncidentStatus.APPROVED]: [
        { status: IncidentStatus.RESOLVED, label: 'Mark Resolved', btnClass: 'bg-secondary bg-opacity-10 text-dark' },
        { status: IncidentStatus.CANCELED, label: 'Cancel', btnClass: 'bg-dark bg-opacity-10 text-dark' },
      ],
      [IncidentStatus.REJECTED]: [
        { status: IncidentStatus.PENDING, label: 'Reopen as Pending', btnClass: 'bg-warning bg-opacity-10 text-dark' },
      ],
      [IncidentStatus.RESOLVED]: [
        { status: IncidentStatus.PENDING, label: 'Reopen as Pending', btnClass: 'bg-warning bg-opacity-10 text-dark' },
      ],
      [IncidentStatus.DUPLICATE]: [
        { status: IncidentStatus.PENDING, label: 'Reopen as Pending', btnClass: 'bg-warning bg-opacity-10 text-dark' },
      ],
      [IncidentStatus.CANCELED]: [
        { status: IncidentStatus.PENDING, label: 'Reopen as Pending', btnClass: 'bg-warning bg-opacity-10 text-dark' },
      ],
    };
    return all[current] || [];
  }
}
