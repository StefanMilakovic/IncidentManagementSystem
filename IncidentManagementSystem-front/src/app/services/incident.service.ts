import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { Incident } from '../models/incident.model';
import {IncidentStatus} from '../models/enums/incident-status.enum';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class IncidentService {

  //private apiUrl = 'http://localhost:8080/api/v1/incidents';
  private apiUrl = `${environment.apiUrl}/incidents`;

  constructor(private http: HttpClient) {}

  createIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl, incident, { withCredentials: true });
  }

  getAllIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl, { withCredentials: true });
  }

  getIncidentById(id: number): Observable<Incident> {
    return this.http.get<Incident>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  updateIncident(id: number, incident: Incident): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}`, incident, { withCredentials: true });
  }

  deleteIncident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  updateIncidentStatus(id: number, status: IncidentStatus): Observable<Incident> {
    return this.http.patch<Incident>(
      `${this.apiUrl}/${id}/status`,
      `"${status}"`,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
  }

  getIncidentsByStatus(status: IncidentStatus): Observable<Incident[]> {
    return this.http.post<Incident[]>(
      `${this.apiUrl}/search`,
      `"${status}"`,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
  }

  getApprovedIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(
      `${this.apiUrl}/approved`,
      { withCredentials: true }
    );
  }
}






