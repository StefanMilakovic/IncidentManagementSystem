package eu.reportincident.incident_service.repository;

import eu.reportincident.incident_service.model.entity.IncidentImage;
import org.springframework.data.jpa.repository.JpaRepository;


public interface IncidentImageRepository extends JpaRepository<IncidentImage, Long> {
}