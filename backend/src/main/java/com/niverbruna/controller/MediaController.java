package com.niverbruna.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
public class MediaController {
  private static final Path MEDIA_DIR = Path.of("backend", "media").toAbsolutePath().normalize();

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MediaUploadResponse upload(@RequestParam("file") MultipartFile file) throws IOException {
    if (file.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo vazio");
    }

    Files.createDirectories(MEDIA_DIR);

    String originalName = file.getOriginalFilename() == null ? "arquivo" : file.getOriginalFilename();
    String safeName = sanitize(originalName);
    String finalName = UUID.randomUUID() + "-" + safeName;
    Path destination = MEDIA_DIR.resolve(finalName).normalize();

    if (!destination.startsWith(MEDIA_DIR)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome de arquivo invalido");
    }

    try (InputStream inputStream = file.getInputStream()) {
      Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
    }

    return new MediaUploadResponse("/media/" + finalName);
  }

  private String sanitize(String value) {
    String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
        .replaceAll("\\p{M}", "");
    String safe = normalized.replaceAll("[^a-zA-Z0-9._-]", "-")
        .replaceAll("-+", "-")
        .replaceAll("^-|-$", "");

    return safe.isBlank() ? "arquivo" : safe;
  }

  public record MediaUploadResponse(String path) {
  }
}
