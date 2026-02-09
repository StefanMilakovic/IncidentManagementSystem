import {IncidentStatus} from './enums/incident-status.enum';

export interface IncidentStatusHistory {
  id?: number;
  incidentId: number;
  status: IncidentStatus;
  statusChangeTime?: string; // ISO string s backenda
  moderatorId?: number;
}
