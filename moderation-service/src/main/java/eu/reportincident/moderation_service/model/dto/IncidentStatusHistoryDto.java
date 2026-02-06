package eu.reportincident.moderation_service.model.dto;

import eu.reportincident.moderation_service.model.enums.IncidentStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentStatusHistoryDto {

    private Long id;
    private Long incidentId;
    private IncidentStatus status;
    private LocalDateTime statusChangeTime;
    private Long moderatorId;
}