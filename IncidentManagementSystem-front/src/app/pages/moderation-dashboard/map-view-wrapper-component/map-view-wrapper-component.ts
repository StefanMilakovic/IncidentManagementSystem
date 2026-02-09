import {Component, OnInit, ViewChild} from '@angular/core';
import {MapView} from '../../../components/map-view/map-view';
import {Incident} from '../../../models/incident.model';
import {IncidentType} from '../../../models/enums/incident-type.enum';
import {IncidentSubtype} from '../../../models/enums/incident-subtype.enum';
import {IncidentStatus} from '../../../models/enums/incident-status.enum';
import {IncidentService} from '../../../services/incident.service';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Navbar} from '../../../components/navbar/navbar';

@Component({
  selector: 'app-map-view-wrapper-component',
  imports: [
    DecimalPipe,
    FormsModule,
    MapView,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    Navbar,
  ],
  templateUrl: './map-view-wrapper-component.html',
  styleUrl: './map-view-wrapper-component.css',
})
export class MapViewWrapperComponent implements OnInit {
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
  selectedStatuses: IncidentStatus[] = [];
  selectedTimeRange: number = 0;

  newIncident: Partial<Incident> = {
    type: IncidentType.ACCIDENT,
    location: { latitude: 44.772, longitude: 17.191 },
    description: '',
    status: IncidentStatus.REPORTED
  };

  incidentTypes = Object.values(IncidentType);
  incidentSubtypes = Object.values(IncidentSubtype);
  incidentStatuses = Object.values(IncidentStatus);

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

  loadIncidents(): void {
    this.incidentService.getAllIncidents().subscribe({
      next: (incidents) => {
        this.incidents = incidents;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading incidents:', error);
        alert('Failed to load incidents. Please try again.');
      }
    });
  }

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

  toggleFilterDialog(): void {
    this.showFilterDialog = !this.showFilterDialog;
  }

  applyFilters(): void {
    let filtered = [...this.incidents];

    if (this.selectedTypes.length > 0) {
      filtered = filtered.filter(incident =>
        this.selectedTypes.includes(incident.type)
      );
    }

    if (this.selectedSubtypes.length > 0) {
      filtered = filtered.filter(incident =>
        incident.subtype && this.selectedSubtypes.includes(incident.subtype)
      );
    }

    if (this.selectedStatuses.length > 0) {
      filtered = filtered.filter(incident =>
        this.selectedStatuses.includes(incident.status)
      );
    }

    if (this.selectedTimeRange > 0) {
      const now = new Date();
      const cutoffDate = new Date(now.getTime() - (this.selectedTimeRange * 24 * 60 * 60 * 1000));

      filtered = filtered.filter(incident => {
        if (!incident.reportedAt) return false;
        const reportedDate = new Date(incident.reportedAt);
        return reportedDate >= cutoffDate;
      });
    }

    this.filteredIncidents = filtered;

    if (this.mapView) {
      this.mapView.incidents = this.filteredIncidents;
      this.mapView.updateMarkers();
    }
  }

  toggleTypeFilter(type: IncidentType): void {
    const index = this.selectedTypes.indexOf(type);
    if (index > -1) {
      this.selectedTypes.splice(index, 1);
    } else {
      this.selectedTypes.push(type);
    }
    this.applyFilters();
  }

  toggleSubtypeFilter(subtype: IncidentSubtype): void {
    const index = this.selectedSubtypes.indexOf(subtype);
    if (index > -1) {
      this.selectedSubtypes.splice(index, 1);
    } else {
      this.selectedSubtypes.push(subtype);
    }
    this.applyFilters();
  }

  setTimeRange(days: number): void {
    this.selectedTimeRange = days;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedTypes = [];
    this.selectedSubtypes = [];
    this.selectedStatuses = [];
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

  closeConfirmationDialog(): void {
    this.showConfirmationDialog = false;
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
  toggleStatusFilter(status: IncidentStatus): void {
    const index = this.selectedStatuses.indexOf(status);
    if (index > -1) {
      this.selectedStatuses.splice(index, 1);
    } else {
      this.selectedStatuses.push(status);
    }
    this.applyFilters();
  }
}
