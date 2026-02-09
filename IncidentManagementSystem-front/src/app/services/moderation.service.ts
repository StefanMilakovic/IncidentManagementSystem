import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncidentStatusHistory } from '../models/incident-status-history.model';

@Injectable({
  providedIn: 'root'
})
export class ModerationService {

  private apiUrl = 'http://localhost:8080/api/v1/moderation';

  constructor(private http: HttpClient) {}

  createStatusHistory(
    history: IncidentStatusHistory
  ): Observable<IncidentStatusHistory> {
    return this.http.post<IncidentStatusHistory>(
      `${this.apiUrl}/create`,
      history,
      { withCredentials: true }
    );
  }

  getAll(): Observable<IncidentStatusHistory[]> {
    return this.http.get<IncidentStatusHistory[]>(
      this.apiUrl,
      { withCredentials: true }
    );
  }

  getById(id: number): Observable<IncidentStatusHistory> {
    return this.http.get<IncidentStatusHistory>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }

  getByIncidentId(incidentId: number): Observable<IncidentStatusHistory[]> {
    return this.http.post<IncidentStatusHistory[]>(
      `${this.apiUrl}/incident`,
      incidentId,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
  }

  update(
    id: number,
    history: IncidentStatusHistory
  ): Observable<IncidentStatusHistory> {
    return this.http.post<IncidentStatusHistory>(
      `${this.apiUrl}/update?id=${id}`,
      history,
      { withCredentials: true }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }
}
