/*
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


 */


import {Component, OnInit, ViewChild} from '@angular/core';
import {MapView} from '../../components/map-view/map-view';
import {Header} from '../../components/header/header';
import {Incident} from '../../models/incident.model';
import {IncidentType} from '../../models/enums/incident-type.enum';
import {IncidentSubtype} from '../../models/enums/incident-subtype.enum';
// NOVO: dodani importi za status i forme
import {IncidentStatus} from '../../models/enums/incident-status.enum';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// PROMJENA: dodat FormsModule, ReactiveFormsModule, DecimalPipe u imports niz ispod
import {IncidentService} from '../../services/incident.service';
import {AuthService, CurrentUser} from '../../auth/auth.service';
import {Router} from '@angular/router';

interface TimeRange {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  // PROMJENA: dodani FormsModule, ReactiveFormsModule, DecimalPipe u imports
  imports: [
    Header,
    MapView,
    NgIf,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    DecimalPipe,
  ],
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  @ViewChild(MapView) mapView!: MapView;

  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];

  showFilterDialog = false;
  isSelectingLocation = false;

  selectedTimeRange?: string;
  selectedTypes: IncidentType[] = [];
  selectedSubtypes: IncidentSubtype[] = [];

  // NOVO: sve varijable za Add dialog, kopirano iz MapViewWrapperComponent
  showAddDialog = false;
  showLocationOptions = false;
  locationSelected = false;
  showConfirmationDialog = false;

  // NOVO: varijable za selekciju lokacije na mapi
  selectedStatuses: IncidentStatus[] = [];
  selectedTimeRangeNumber: number = 0;

  // NOVO: novi incident objekat, kopirano iz MapViewWrapperComponent
  newIncident: Partial<Incident> = {
    type: IncidentType.ACCIDENT,
    location: { latitude: 44.772, longitude: 17.191 },
    description: '',
    status: IncidentStatus.REPORTED
  };

  // NOVO: enum vrijednosti za template
  incidentStatuses = Object.values(IncidentStatus);

  // NOVO: upload slika, kopirano iz MapViewWrapperComponent
  selectedFiles: { file: File; preview: string }[] = [];
  maxPhotos = 5;

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
        // PROMJENA: umjesto redirecta, ostaje na dashboardu kao anonimni korisnik
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

  // ─────────────────────────────────────────────
  // NOVO: Add dialog metode, kopirano iz MapViewWrapperComponent
  // ─────────────────────────────────────────────

  openAddDialog(): void {
    this.showAddDialog = true;
    this.locationSelected = false;
    this.showLocationOptions = false;
    this.isSelectingLocation = false;
    this.selectedFiles = [];
    this.newIncident = {
      type: IncidentType.ACCIDENT,
      location: { latitude: 44.772, longitude: 17.191 },
      description: '',
      status: IncidentStatus.REPORTED
    };
  }

  closeAddDialog(): void {
    this.showAddDialog = false;
    this.locationSelected = false;
    this.showLocationOptions = false;
    this.isSelectingLocation = false;
    this.selectedFiles = [];
  }

  cancelLocationSelection(): void {
    this.showLocationOptions = false;
    this.isSelectingLocation = false;
  }

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (this.newIncident.location) {
            this.newIncident.location.latitude = position.coords.latitude;
            this.newIncident.location.longitude = position.coords.longitude;
            this.locationSelected = true;
            this.showLocationOptions = false;
            this.isSelectingLocation = false;
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please select location on map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please select location on map.');
    }
  }

  selectLocationOnMap(): void {
    this.isSelectingLocation = true;
    this.showLocationOptions = false;
  }

  onLocationSelected(location: { lat: number; lng: number }): void {
    if (this.newIncident.location) {
      this.newIncident.location.latitude = location.lat;
      this.newIncident.location.longitude = location.lng;
      this.locationSelected = true;
      this.isSelectingLocation = false;
    }
  }

  submitIncident(): void {
    if (this.newIncident.type && this.newIncident.location && this.locationSelected) {
      const incidentToSubmit: Incident = {
        type: this.newIncident.type,
        subtype: this.newIncident.subtype,
        location: this.newIncident.location,
        description: this.newIncident.description || '',
        status: IncidentStatus.REPORTED,
        reportedAt: new Date().toISOString()
      };

      // TODO: logika za slike

      this.incidentService.createIncident(incidentToSubmit).subscribe({
        next: (createdIncident) => {
          console.log('Incident created successfully:', createdIncident);
          this.closeAddDialog();
          this.showConfirmationDialog = true;
          this.loadIncidents();
        },
        error: (error) => {
          console.error('Error creating incident:', error);
          alert('Failed to submit incident. Please try again.');
        }
      });
    }
  }

  closeConfirmationDialog(): void {
    this.showConfirmationDialog = false;
  }

  // NOVO: upload slika metode, kopirano iz MapViewWrapperComponent
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const remaining = this.maxPhotos - this.selectedFiles.length;
    const files = Array.from(input.files).slice(0, remaining);

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedFiles.push({
            file,
            preview: e.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      }
    });
    input.value = '';
  }

  removePhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  // ─────────────────────────────────────────────
  // Postojeće filter metode (nepromijenjene)
  // ─────────────────────────────────────────────

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

  // NOVO: status filter, kopirano iz MapViewWrapperComponent
  toggleStatusFilter(status: IncidentStatus): void {
    const index = this.selectedStatuses.indexOf(status);
    if (index > -1) {
      this.selectedStatuses.splice(index, 1);
    } else {
      this.selectedStatuses.push(status);
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedTimeRange = undefined;
    this.selectedTypes = [];
    this.selectedSubtypes = [];
    // NOVO: dodano čišćenje statusa
    this.selectedStatuses = [];
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
      // NOVO: status filter dodat u applyFilters
      if (this.selectedStatuses.length > 0) {
        matches = matches && this.selectedStatuses.includes(incident.status);
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

    // NOVO: updateovanje markera na mapi nakon filtriranja, kopirano iz MapViewWrapperComponent
    if (this.mapView) {
      this.mapView.incidents = this.filteredIncidents;
      this.mapView.updateMarkers();
    }
  }

  getIncidentTypeLabel(type: IncidentType): string {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  getIncidentSubtypeLabel(subtype: IncidentSubtype): string {
    return subtype.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
