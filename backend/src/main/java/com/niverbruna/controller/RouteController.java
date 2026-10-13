package com.niverbruna.controller;

import com.niverbruna.model.Card;
import com.niverbruna.model.RouteState;
import com.niverbruna.service.RouteService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RouteController {
  private final RouteService routeService;

  public RouteController(RouteService routeService) {
    this.routeService = routeService;
  }

  @GetMapping("/health")
  public HealthResponse health() {
    return new HealthResponse(true);
  }

  @GetMapping("/route")
  public RouteState getRoute() {
    return routeService.getRoute();
  }

  @PutMapping("/route")
  public RouteState updateDate(@Valid @RequestBody UpdateDateRequest request) {
    return routeService.updateBirthdayDate(request.birthdayDate());
  }

  @PostMapping("/route/reset")
  public RouteState resetRoute() {
    return routeService.reset();
  }

  @PostMapping("/cards")
  @ResponseStatus(HttpStatus.CREATED)
  public RouteState createCard(@Valid @RequestBody Card card) {
    return routeService.addCard(card);
  }

  @DeleteMapping("/cards/{id}")
  public RouteState deleteCard(@PathVariable String id) {
    return routeService.removeCard(id);
  }

  public record HealthResponse(boolean ok) {
  }

  public record UpdateDateRequest(@NotBlank String birthdayDate) {
  }
}
