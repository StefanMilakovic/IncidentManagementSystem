package eu.reportincident.incident_service.controller;

import eu.reportincident.incident_service.model.dto.IncidentDto;
import eu.reportincident.incident_service.model.enums.IncidentStatus;
import eu.reportincident.incident_service.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public ResponseEntity<IncidentDto> createIncident(@RequestBody IncidentDto incidentDto) {
        IncidentDto created = incidentService.createIncident(incidentDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<IncidentDto>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<IncidentDto> getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentDto> updateIncident(@PathVariable Long id, @RequestBody IncidentDto incidentDto) {
        return incidentService.updateIncident(id, incidentDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentDto> updateIncidentStatus(
            @PathVariable Long id,
            @RequestBody IncidentStatus status) {

        return incidentService.updateIncidentStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/search")
    public ResponseEntity<List<IncidentDto>> getIncidentsByStatus(
            @RequestBody IncidentStatus status) {

        return ResponseEntity.ok(
                incidentService.getIncidentsByStatus(status)
        );
    }

    @GetMapping("/approved")
    public ResponseEntity<List<IncidentDto>> getApprovedIncidents() {
        return ResponseEntity.ok(
                incidentService.getIncidentsByStatus(IncidentStatus.APPROVED)
        );
    }



}

