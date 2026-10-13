package com.niverbruna.controller;

import com.niverbruna.service.NotificationService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api")
public class NotificationController {
  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping(path = "/notifications", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter notifications() {
    return notificationService.connect();
  }
}
