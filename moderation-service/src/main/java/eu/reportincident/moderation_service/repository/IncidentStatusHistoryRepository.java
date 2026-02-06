package eu.reportincident.moderation_service.repository;

import eu.reportincident.moderation_service.model.entity.IncidentStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentStatusHistoryRepository extends JpaRepository<IncidentStatusHistory, Long> {
    List<IncidentStatusHistory> findByIncidentId(Long incidentId);
}
