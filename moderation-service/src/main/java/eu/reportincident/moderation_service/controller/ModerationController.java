package eu.reportincident.moderation_service.controller;

import eu.reportincident.moderation_service.model.dto.IncidentStatusHistoryDto;
import eu.reportincident.moderation_service.service.ModerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/moderation")
@RequiredArgsConstructor
public class ModerationController {

    private final ModerationService moderationService;

    @PostMapping("/create")
    public ResponseEntity<IncidentStatusHistoryDto> create(@RequestBody IncidentStatusHistoryDto dto) {
        return ResponseEntity.ok(moderationService.createStatusHistory(dto));
    }

    @GetMapping
    public ResponseEntity<List<IncidentStatusHistoryDto>> getAll() {
        return ResponseEntity.ok(moderationService.getAll());
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<IncidentStatusHistoryDto> getById(@PathVariable Long id) {
        return moderationService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/incident")
    public ResponseEntity<List<IncidentStatusHistoryDto>> getByIncidentId(@RequestBody Long incidentId) {
        return ResponseEntity.ok(moderationService.getByIncidentId(incidentId));
    }

    @PostMapping("/update")
    public ResponseEntity<IncidentStatusHistoryDto> update(@RequestParam Long id, @RequestBody IncidentStatusHistoryDto dto) {
        return moderationService.update(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        moderationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}