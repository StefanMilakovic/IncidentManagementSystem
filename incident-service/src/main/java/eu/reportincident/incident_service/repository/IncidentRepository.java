package eu.reportincident.incident_service.repository;

import eu.reportincident.incident_service.model.entity.Incident;
import eu.reportincident.incident_service.model.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatus(IncidentStatus status);
}
