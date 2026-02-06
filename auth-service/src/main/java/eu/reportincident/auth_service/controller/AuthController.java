package eu.reportincident.auth_service.controller;

import eu.reportincident.auth_service.model.dto.UserDto;
import eu.reportincident.auth_service.security.JwtUtil;
import eu.reportincident.auth_service.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    //test
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/current-user")
    public ResponseEntity<UserDto> getCurrentUser(@CookieValue(name = "IS_MS", required = false) String token) {
        try {
            UserDto userDto = authService.getCurrentUserFromToken(token);
            return ResponseEntity.ok(userDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("IS_MS", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok("Logged out successfully");
    }




    //---------------------------------------------------------------------------------------------------------
    //TEST
    @GetMapping("/test-cookie")
    public String testCookie(@CookieValue(name = "IS_MS", required = false) String token) {
        if (token == null) return "No cookie received";
        return "Cookie OK: " + token;
    }

    @GetMapping("/test-jwt")
    public String testJwt(@CookieValue(name = "IS_MS", required = false) String token) {
        if (token == null) return "No token";
        boolean valid = jwtUtil.isTokenValid(token);
        if (!valid) return "Token invalid";
        return "Token OK, email: " + jwtUtil.extractEmail(token);
    }


}