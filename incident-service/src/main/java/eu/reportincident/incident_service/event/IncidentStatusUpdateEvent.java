package eu.reportincident.incident_service.event;

import eu.reportincident.incident_service.model.enums.IncidentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


////One služe isključivo za komunikaciju između mikroservisa putem poruka (RabbitMQ)
///

/*
@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncidentStatusUpdateEvent {
    private Long incidentId;
    private IncidentStatus status;
    private LocalDateTime timestamp;
}

 */


