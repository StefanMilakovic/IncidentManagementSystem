import { IncidentType } from './enums/incident-type.enum';
import { IncidentSubtype } from './enums/incident-subtype.enum';
import { IncidentStatus } from './enums/incident-status.enum';
import { Location } from './location.model';
import { IncidentImage } from './incident-image.model';

export interface Incident {
  id?: number;
  type: IncidentType;
  subtype?: IncidentSubtype;
  location: Location;
  description?: string;
  images?: IncidentImage[];
  reportedAt?: string; // ISO string, može se parsirati u Date
  status: IncidentStatus;
}
