package com.niverbruna.model;

import java.util.ArrayList;
import java.util.List;

public class RouteState {
  private String birthdayDate;
  private List<Card> cards = new ArrayList<>();

  public RouteState() {
  }

  public RouteState(String birthdayDate, List<Card> cards) {
    this.birthdayDate = birthdayDate;
    this.cards = cards;
  }

  public String getBirthdayDate() {
    return birthdayDate;
  }

  public void setBirthdayDate(String birthdayDate) {
    this.birthdayDate = birthdayDate;
  }

  public List<Card> getCards() {
    return cards;
  }

  public void setCards(List<Card> cards) {
    this.cards = cards;
  }
}
