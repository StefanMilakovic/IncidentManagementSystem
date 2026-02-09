import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { MapView } from '../../components/map-view/map-view';
import { IncidentService } from '../../services/incident.service';
import { Incident } from '../../models/incident.model';
import { IncidentType } from '../../models/enums/incident-type.enum';
import { IncidentSubtype } from '../../models/enums/incident-subtype.enum';
import { IncidentStatus } from '../../models/enums/incident-status.enum';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    MapView,
    FormsModule
  ],
  templateUrl: './incidents.html',
  styleUrl: './incidents.css',
})
export class Incidents implements OnInit {
  @ViewChild(MapView) mapView!: MapView;

  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];
  showAddDialog = false;
  showFilterDialog = false;

  isSelectingLocation = false;
  showLocationOptions = false;
  locationSelected = false;

  selectedTypes: IncidentType[] = [];
  selectedSubtypes: IncidentSubtype[] = [];
  selectedTimeRange: number = 0;


  newIncident: Partial<Incident> = {
    type: IncidentType.ACCIDENT,
    location: { latitude: 44.772, longitude: 17.191, radius: 1000 },
    description: ''
  };

  incidentTypes = Object.values(IncidentType);
  incidentSubtypes = Object.values(IncidentSubtype);


  timeRanges = [
    { label: 'All Reports', value: 0 },
    { label: 'Last 24h', value: 1 },
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 31 Days', value: 31 }
  ];

  selectedFiles: { file: File; preview: string }[] = [];
  maxPhotos = 5;

  showConfirmationDialog = false;

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  openAddDialog(): void {
    this.showAddDialog = true;
    this.locationSelected = false;
    this.showLocationOptions = false;
    this.isSelectingLocation = false;
    this.newIncident = {
      type: IncidentType.ACCIDENT,
      location: { latitude: 44.772, longitude: 17.191, radius: 1000 },
      description: ''
    };
    this.selectedFiles = [];
  }

  closeAddDialog(): void {
    this.showAddDialog = false;
    this.locationSelected = false;
    this.showLocationOptions = false;
    this.isSelectingLocation = false;
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
            this.newIncident.location.radius = 1000;
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
      this.newIncident.location.radius = 1000;
      this.locationSelected = true;
      this.isSelectingLocation = false;
    }
  }

  submitIncident(): void {
    if (!this.newIncident.location || !this.newIncident.type) return;

    const incident: Incident = {
      ...this.newIncident,
      location: this.newIncident.location as any,
      status: IncidentStatus.REPORTED
    } as Incident;

    this.incidentService.createIncident(incident).subscribe(saved => {
      this.incidents.push(saved);
      this.applyFilters();
      this.closeAddDialog();
    });
  }

  toggleFilterDialog(): void {
    this.showFilterDialog = !this.showFilterDialog;
  }

  applyFilters(): void {
    let filtered = [...this.incidents];

    if (this.selectedTypes.length > 0) {
      filtered = filtered.filter(i => this.selectedTypes.includes(i.type));
    }

    if (this.selectedSubtypes.length > 0) {
      filtered = filtered.filter(i => i.subtype && this.selectedSubtypes.includes(i.subtype));
    }

    if (this.selectedTimeRange > 0) {
      const now = Date.now();
      filtered = filtered.filter(i => i.reportedAt && (new Date(i.reportedAt).getTime() >= now - this.selectedTimeRange * 24 * 60 * 60 * 1000));
    }

    this.filteredIncidents = filtered;

    if (this.mapView) {
      this.mapView.incidents = this.filteredIncidents;
      this.mapView.updateMarkers();
    }
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
  toggleTypeFilter(type: IncidentType): void {
    const index = this.selectedTypes.indexOf(type);
    if (index > -1) this.selectedTypes.splice(index, 1);
    else this.selectedTypes.push(type);
    this.applyFilters();
  }

  toggleSubtypeFilter(subtype: IncidentSubtype): void {
    const index = this.selectedSubtypes.indexOf(subtype);
    if (index > -1) this.selectedSubtypes.splice(index, 1);
    else this.selectedSubtypes.push(subtype);
    this.applyFilters();
  }

  setTimeRange(days: number): void {
    this.selectedTimeRange = days;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedTypes = [];
    this.selectedSubtypes = [];
    this.selectedTimeRange = 0;
    this.applyFilters();
  }

  getIncidentTypeLabel(type: IncidentType): string {
    const labels = {
      [IncidentType.FIRE]: 'Fire',
      [IncidentType.FLOOD]: 'Flood',
      [IncidentType.ACCIDENT]: 'Accident',
      [IncidentType.CRIME]: 'Crime'
    };
    return labels[type];
  }

  getIncidentSubtypeLabel(subtype: IncidentSubtype): string {
    const labels = {
      [IncidentSubtype.CAR_ACCIDENT]: 'Car Accident',
      [IncidentSubtype.BUILDING_FIRE]: 'Building Fire',
      [IncidentSubtype.ROBBERY]: 'Robbery',
      [IncidentSubtype.ASSAULT]: 'Assault'
    };
    return labels[subtype];
  }

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

  closeConfirmationDialog(): void {
    this.showConfirmationDialog = false;
  }
}

