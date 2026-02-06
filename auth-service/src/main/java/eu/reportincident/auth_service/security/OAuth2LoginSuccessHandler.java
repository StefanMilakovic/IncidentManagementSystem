package eu.reportincident.auth_service.security;

import eu.reportincident.auth_service.model.entity.UserEntity;
import eu.reportincident.auth_service.model.enums.UserRole;
import eu.reportincident.auth_service.repository.UserEntityRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserEntityRepository userEntityRepository;
    private final JwtUtil jwtUtil;

    @Value("${cookie.name}")
    private String cookieName;

    @Value("${cookie.domain}")
    private String cookieDomain;

    public OAuth2LoginSuccessHandler(
            UserEntityRepository userEntityRepository,
            JwtUtil jwtUtil) {
        this.userEntityRepository = userEntityRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        UserEntity user = userEntityRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserEntity newUser = new UserEntity();
                    newUser.setEmail(email);
                    newUser.setName(name);

                    if (email != null && email.endsWith(".etf.unibl.org")) {
                        newUser.setRole(UserRole.MODERATOR);
                    } else {
                        newUser.setRole(UserRole.USER);
                    }

                    return userEntityRepository.save(newUser);
                });

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        ResponseCookie cookie = ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(true)
                .domain(cookieDomain)
                .path("/")
                .maxAge(Duration.ofMillis(jwtUtil.getExpirationMs()))
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:4200/dashboard");
    }


}
