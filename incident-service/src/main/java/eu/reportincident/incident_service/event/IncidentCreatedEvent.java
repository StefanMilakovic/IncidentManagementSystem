package eu.reportincident.incident_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

//One služe isključivo za komunikaciju između mikroservisa putem poruka (RabbitMQ)

/*
@Data
@AllArgsConstructor
@NoArgsConstructor
public class IncidentCreatedEvent implements Serializable {
    private Long incidentId;
    private LocalDateTime timestamp;
}


 */