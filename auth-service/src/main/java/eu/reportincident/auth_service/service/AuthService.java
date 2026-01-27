package eu.reportincident.auth_service.service;

import eu.reportincident.auth_service.exception.InvalidTokenException;
import eu.reportincident.auth_service.exception.UserNotFoundException;
import eu.reportincident.auth_service.model.dto.UserDto;
import eu.reportincident.auth_service.model.entity.UserEntity;
import eu.reportincident.auth_service.repository.UserEntityRepository;
import eu.reportincident.auth_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final UserEntityRepository userEntityRepository;

    public UserDto getCurrentUserFromToken(String token) {
        if (token == null || !jwtUtil.isTokenValid(token)) {
            throw new InvalidTokenException();
        }

        String email = jwtUtil.extractEmail(token);
        UserEntity user = userEntityRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }
}