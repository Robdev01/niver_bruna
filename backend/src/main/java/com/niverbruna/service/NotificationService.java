package com.niverbruna.service;

import com.niverbruna.model.Card;
import com.niverbruna.model.RouteState;
import com.niverbruna.model.UnlockNotification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificationService {
  private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");

  private final RouteService routeService;
  private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
  private final Set<String> notified = ConcurrentHashMap.newKeySet();

  public NotificationService(RouteService routeService) {
    this.routeService = routeService;
  }

  public SseEmitter connect() {
    SseEmitter emitter = new SseEmitter(0L);
    emitters.add(emitter);

    emitter.onCompletion(() -> emitters.remove(emitter));
    emitter.onTimeout(() -> emitters.remove(emitter));
    emitter.onError(error -> emitters.remove(emitter));

    try {
      emitter.send(SseEmitter.event().name("connected").data("{\"ok\":true}"));
    } catch (IOException error) {
      emitters.remove(emitter);
    }

    return emitter;
  }

  @Scheduled(fixedRate = 1000)
  public void notifyDueCards() {
    RouteState route = routeService.getRoute();
    LocalDate today = LocalDate.now(ZONE);
    LocalDate birthdayDate = LocalDate.parse(route.getBirthdayDate());

    if (!today.equals(birthdayDate)) {
      return;
    }

    LocalDateTime now = LocalDateTime.now(ZONE);
    for (Card card : route.getCards()) {
      LocalDateTime unlockAt = LocalDateTime.of(birthdayDate, LocalTime.parse(card.getTime()));
      String notificationKey = card.getId() + "|" + route.getBirthdayDate();

      if (!now.isBefore(unlockAt) && notified.add(notificationKey)) {
        broadcast(new UnlockNotification(card.getTime() + " liberou!", card.getMessage(), card));
      }
    }
  }

  private void broadcast(UnlockNotification notification) {
    for (SseEmitter emitter : emitters) {
      try {
        emitter.send(SseEmitter.event().name("card-unlocked").data(notification));
      } catch (IOException error) {
        emitters.remove(emitter);
      }
    }
  }
}
