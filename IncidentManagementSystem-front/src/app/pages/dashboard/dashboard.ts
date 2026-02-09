import {Component, OnInit, ViewChild} from '@angular/core';
import {MapView} from '../../components/map-view/map-view';
import {Header} from '../../components/header/header';
import {Incident} from '../../models/incident.model';
import {IncidentType} from '../../models/enums/incident-type.enum';
import {IncidentSubtype} from '../../models/enums/incident-subtype.enum';
import {IncidentService} from '../../services/incident.service';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService, CurrentUser} from '../../auth/auth.service';
import {Router} from '@angular/router';

interface TimeRange {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [
    Header,
    MapView,
    NgIf,
    NgForOf
  ],
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];

  showFilterDialog = false;
  isSelectingLocation = false;

  selectedTimeRange?: string;
  selectedTypes: IncidentType[] = [];
  selectedSubtypes: IncidentSubtype[] = [];

  timeRanges: TimeRange[] = [
    { label: 'Last 24h', value: '24h' },
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'All time', value: 'all' }
  ];

  incidentTypes: IncidentType[] = [
    IncidentType.FIRE,
    IncidentType.FLOOD,
    IncidentType.ACCIDENT,
    IncidentType.CRIME
  ];

  incidentSubtypes: IncidentSubtype[] = [
    IncidentSubtype.CAR_ACCIDENT,
    IncidentSubtype.BUILDING_FIRE,
    IncidentSubtype.ROBBERY,
    IncidentSubtype.ASSAULT
  ];

  user: CurrentUser | null = null;

  constructor(private incidentService: IncidentService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.fetchCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        if (user?.role === 'MODERATOR') {
          this.router.navigate(['/moderation-dashboard']);
        } else if (user?.role === 'USER') {
          this.router.navigate(['/incidents']);
        }
      },
      error: () => {
        this.user = null;
      }
    });

    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidentService.getApprovedIncidents().subscribe({
      next: (data) => {
        this.incidents = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Greška prilikom dohvatanja approved incidenata:', err);
      }
    });
  }

  toggleFilterDialog(): void {
    this.showFilterDialog = !this.showFilterDialog;
  }

  setTimeRange(range: string): void {
    this.selectedTimeRange = range;
    this.applyFilters();
  }

  toggleTypeFilter(type: IncidentType): void {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    } else {
      this.selectedTypes.push(type);
    }
    this.applyFilters();
  }

  toggleSubtypeFilter(subtype: IncidentSubtype): void {
    if (this.selectedSubtypes.includes(subtype)) {
      this.selectedSubtypes = this.selectedSubtypes.filter(s => s !== subtype);
    } else {
      this.selectedSubtypes.push(subtype);
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedTimeRange = undefined;
    this.selectedTypes = [];
    this.selectedSubtypes = [];
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredIncidents = this.incidents.filter(incident => {
      let matches = true;

      if (this.selectedTypes.length > 0) {
        matches = matches && this.selectedTypes.includes(incident.type);
      }
      if (this.selectedSubtypes.length > 0 && incident.subtype) {
        matches = matches && this.selectedSubtypes.includes(incident.subtype);
      }
      if (this.selectedTimeRange && incident.reportedAt) {
        const reported = new Date(incident.reportedAt).getTime();
        const now = Date.now();
        switch (this.selectedTimeRange) {
          case '24h':
            matches = matches && (reported >= now - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            matches = matches && (reported >= now - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            matches = matches && (reported >= now - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'all':
          default:
            break;
        }
      }

      return matches;
    });
  }

  getIncidentTypeLabel(type: IncidentType): string {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  getIncidentSubtypeLabel(subtype: IncidentSubtype): string {
    return subtype.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}

