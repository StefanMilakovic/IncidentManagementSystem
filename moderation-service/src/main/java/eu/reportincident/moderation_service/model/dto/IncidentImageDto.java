package eu.reportincident.moderation_service.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentImageDto {

    private Long id;
    private String imageUrl;
}