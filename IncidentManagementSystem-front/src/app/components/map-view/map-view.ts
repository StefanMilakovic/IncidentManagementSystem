import { AfterViewInit, Component, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { Incident } from '../../models/incident.model';
import { IncidentType } from '../../models/enums/incident-type.enum';

@Component({
  selector: 'app-map-view',
  imports: [],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css',
})
export class MapView implements AfterViewInit, OnDestroy, OnChanges {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private clickHandler: any;

  @Input() incidents: Incident[] = [];
  @Input() enableLocationPicker: boolean = false;
  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  private readonly MARKER_ICONS = {
    [IncidentType.FIRE]: this.createIcon('#ff4444', '🔥'),
    [IncidentType.FLOOD]: this.createIcon('#4444ff', '💧'),
    [IncidentType.ACCIDENT]: this.createIcon('#ff8800', '🚗'),
    [IncidentType.CRIME]: this.createIcon('#aa0000', '⚠️')
  };

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.updateMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enableLocationPicker'] && this.map) {
      this.enableLocationPicker ? this.enableMapClick() : this.disableMapClick();
    }

    if (changes['incidents'] && this.map) {
      this.updateMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.disableMapClick();
      this.map.remove();
    }
  }

  private addCustomZoomControl(): void {
    const zoomControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: (map: L.Map) => {
        const container = L.DomUtil.create('div', 'leaflet-zoom-control bg-white shadow-sm rounded-pill p-1 d-flex flex-column');
        const debounce = (func: () => void, delay: number) => {
          let timeoutId: any;
          return () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { func(); timeoutId = null; }, delay);
          };
        };

        const createZoomButton = (type: 'in' | 'out') => {
          const button = L.DomUtil.create('button', 'btn btn-sm bg-secondary bg-opacity-10 text-dark rounded-pill mb-1 d-flex align-items-center justify-content-center', container);
          button.innerHTML = type === 'in' ? '<i class="bi bi-zoom-in fs-6"></i>' : '<i class="bi bi-zoom-out fs-6"></i>';
          button.setAttribute('type', 'button');
          button.setAttribute('title', type === 'in' ? 'Zoom In' : 'Zoom Out');
          button.style.width = '40px'; button.style.height = '40px';
          const debouncedZoom = debounce(() => type === 'in' ? map.zoomIn() : map.zoomOut(), 200);
          L.DomEvent.on(button, 'click', L.DomEvent.stop)
            .on(button, 'click', debouncedZoom)
            .on(button, 'mousedown', L.DomEvent.stop)
            .on(button, 'dblclick', L.DomEvent.stop);
          return button;
        };

        createZoomButton('in'); createZoomButton('out');
        return container;
      }
    });
    this.map.addControl(new zoomControl());
  }

  private initMap(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    this.map = L.map(mapContainer, {
      center: [44.772, 17.191],
      zoom: 13,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.addCustomZoomControl();
  }


  private enableMapClick(): void {
    if (!this.map) return;
    this.disableMapClick();
    this.clickHandler = (e: L.LeafletMouseEvent) => this.locationSelected.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    this.map.on('click', this.clickHandler);
    this.map.getContainer().style.cursor = 'crosshair';
  }

  private disableMapClick(): void {
    if (!this.map || !this.clickHandler) return;
    this.map.off('click', this.clickHandler);
    this.clickHandler = null;
    this.map.getContainer().style.cursor = '';
  }

  private markerClusterGroup!: L.MarkerClusterGroup;

  public updateMarkers(): void {
    if (!this.map || !this.incidents) return;

    if (this.markerClusterGroup) {
      this.map.removeLayer(this.markerClusterGroup);
    }

    // Create a new marker cluster group
    this.markerClusterGroup = L.markerClusterGroup({
      // Customize clustering options
      maxClusterRadius: 50, // Adjust this value to control when markers cluster
      disableClusteringAtZoom: 13, // Disable clustering at this zoom level
      spiderfyOnMaxZoom: true, // Spread markers in a spider-like formation when clicked
      showCoverageOnHover: true, // Show the area covered by a cluster on hover
      zoomToBoundsOnClick: true // Zoom to show all markers in a cluster when clicked
    });

    this.incidents.forEach(incident => {
      if (!incident || !incident.location) {
        console.warn('Skipping incident without location:', incident);
        return;
      }

      const icon = this.MARKER_ICONS[incident.type];
      const marker = L.marker([incident.location.latitude, incident.location.longitude], { icon });

      const popupContent = `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 8px 0;">${this.getIncidentTypeLabel(incident.type)}</h4>
        ${incident.subtype ? `<p style="margin: 0 0 4px 0;"><strong>Subtype:</strong> ${this.getIncidentSubtypeLabel(incident.subtype)}</p>` : ''}
        ${incident.description ? `<p style="margin: 0 0 4px 0;">${incident.description}</p>` : ''}
        <p style="margin: 0; font-size: 12px; color: #666;">
          ${new Date(incident.reportedAt || '').toLocaleString('en-US')}
        </p>
      </div>
    `;
      marker.bindPopup(popupContent);
      this.markerClusterGroup.addLayer(marker);
    });
    this.map.addLayer(this.markerClusterGroup);

    if (this.markerClusterGroup.getLayers().length > 0) {
      this.map.fitBounds(this.markerClusterGroup.getBounds(), { padding: [50, 50] });
    }
  }


  private createIcon(color: string, emoji: string): L.DivIcon {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transform: rotate(-45deg);
        ">
          <span style="transform: rotate(45deg);">${emoji}</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });
  }

  private getIncidentTypeLabel(type: IncidentType): string {
    const labels = {
      [IncidentType.FIRE]: 'Fire',
      [IncidentType.FLOOD]: 'Flood',
      [IncidentType.ACCIDENT]: 'Accident',
      [IncidentType.CRIME]: 'Crime'
    };
    return labels[type];
  }

  private getIncidentSubtypeLabel(subtype: string): string {
    const labels: { [key: string]: string } = {
      'CAR_ACCIDENT': 'Car Accident',
      'BUILDING_FIRE': 'Building Fire',
      'ROBBERY': 'Robbery',
      'ASSAULT': 'Assault'
    };
    return labels[subtype] || subtype;
  }
}

