package eu.reportincident.moderation_service.service;

import eu.reportincident.moderation_service.model.dto.IncidentStatusHistoryDto;
import eu.reportincident.moderation_service.model.entity.IncidentStatusHistory;
import eu.reportincident.moderation_service.repository.IncidentStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModerationService {

    private final IncidentStatusHistoryRepository repository;
    private final ModelMapper modelMapper;

    public IncidentStatusHistoryDto createStatusHistory(IncidentStatusHistoryDto dto) {
        IncidentStatusHistory entity = modelMapper.map(dto, IncidentStatusHistory.class);
        entity.setStatusChangeTime(LocalDateTime.now());

        IncidentStatusHistory saved = repository.save(entity);
        return modelMapper.map(saved, IncidentStatusHistoryDto.class);
    }

    public List<IncidentStatusHistoryDto> getAll() {
        return repository.findAll()
                .stream()
                .map(entity -> modelMapper.map(entity, IncidentStatusHistoryDto.class))
                .collect(Collectors.toList());
    }

    public Optional<IncidentStatusHistoryDto> getById(Long id) {
        return repository.findById(id)
                .map(entity -> modelMapper.map(entity, IncidentStatusHistoryDto.class));
    }

    public List<IncidentStatusHistoryDto> getByIncidentId(Long incidentId) {
        return repository.findByIncidentId(incidentId)
                .stream()
                .map(entity -> modelMapper.map(entity, IncidentStatusHistoryDto.class))
                .collect(Collectors.toList());
    }

    public Optional<IncidentStatusHistoryDto> update(Long id, IncidentStatusHistoryDto dto) {
        return repository.findById(id)
                .map(existing -> {
                    modelMapper.map(dto, existing);
                    IncidentStatusHistory updated = repository.save(existing);
                    return modelMapper.map(updated, IncidentStatusHistoryDto.class);
                });
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
