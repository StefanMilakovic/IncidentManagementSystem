package eu.reportincident.incident_service.model.request;

import eu.reportincident.incident_service.model.dto.IncidentImageDto;
import eu.reportincident.incident_service.model.dto.LocationDto;
import eu.reportincident.incident_service.model.enums.IncidentSubtype;
import eu.reportincident.incident_service.model.enums.IncidentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

//Ovo je REQUEST DTO
//tj. objekat koji predstavlja tijelo HTTP requesta (@RequestBody).
//
//Jedna rečenica:
//
//Ovo je model onoga što KLIJENT ŠALJE tvom API-ju.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequest {
    private IncidentType type;
    private IncidentSubtype subtype;
    private LocationDto locationDto;
    private String description;
    private List<IncidentImageDto> images;
}
