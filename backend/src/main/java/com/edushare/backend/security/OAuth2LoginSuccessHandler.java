package com.edushare.backend.security;

import com.edushare.backend.model.UserModel;
import com.edushare.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Value("${app.oauth2.redirectUri}")
    private String redirectUri;

    public OAuth2LoginSuccessHandler(JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Save or update user in database
        Optional<UserModel> existingUser = userRepository.findByEmail(email);
        UserModel user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setFullName(name); // Update name in case it changed
        } else {
            user = new UserModel();
            user.setEmail(email);
            user.setFullName(name);
        }
        userRepository.save(user);

        String token = tokenProvider.generateToken(authentication);
        String redirectUrl = redirectUri + "?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}