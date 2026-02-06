package eu.reportincident.incident_service.service;

import eu.reportincident.incident_service.model.dto.IncidentDto;
import eu.reportincident.incident_service.model.entity.Incident;
import eu.reportincident.incident_service.model.enums.IncidentStatus;
import eu.reportincident.incident_service.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final ModelMapper modelMapper;

    public IncidentDto createIncident(IncidentDto incidentDto) {
        Incident entity = modelMapper.map(incidentDto, Incident.class);
        Incident saved = incidentRepository.save(entity);
        return modelMapper.map(saved, IncidentDto.class);
    }

    public List<IncidentDto> getAllIncidents() {
        return incidentRepository.findAll()
                .stream()
                .map(entity -> modelMapper.map(entity, IncidentDto.class))
                .collect(Collectors.toList());
    }

    public Optional<IncidentDto> getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .map(entity -> modelMapper.map(entity, IncidentDto.class));
    }

    public Optional<IncidentDto> updateIncident(Long id, IncidentDto incidentDto) {
        return incidentRepository.findById(id)
                .map(existing -> {
                    modelMapper.map(incidentDto, existing);
                    Incident updated = incidentRepository.save(existing);
                    return modelMapper.map(updated, IncidentDto.class);
                });
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }

    public Optional<IncidentDto> updateIncidentStatus(Long id, IncidentStatus status) {
        return incidentRepository.findById(id)
                .map(existing -> {
                    existing.setStatus(status);
                    existing.setLastUpdated(LocalDateTime.now());
                    Incident updated = incidentRepository.save(existing);
                    return modelMapper.map(updated, IncidentDto.class);
                });
    }

    public List<IncidentDto> getIncidentsByStatus(IncidentStatus status) {
        return incidentRepository.findByStatus(status)
                .stream()
                .map(entity -> modelMapper.map(entity, IncidentDto.class))
                .collect(Collectors.toList());
    }


}


