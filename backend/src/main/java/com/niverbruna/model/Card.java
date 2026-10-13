package com.niverbruna.model;

import jakarta.validation.constraints.NotBlank;

public class Card {
  private String id;

  @NotBlank
  private String time;

  @NotBlank
  private String title;

  private String place;
  private String surprise;
  private String photoPath;
  private String videoPath;

  @NotBlank
  private String message;

  private String iconName;
  private String color;
  private boolean soundCar;
  private boolean isQuestionCard;
  private String questionText;
  private String youtubeUrl;

  public Card() {
  }

  public Card(String id, String time, String title, String place, String surprise, String photoPath, String videoPath, String message, String iconName, String color, boolean soundCar) {
    this(id, time, title, place, surprise, photoPath, videoPath, message, iconName, color, soundCar, false, "", "");
  }

  public Card(String id, String time, String title, String place, String surprise, String photoPath, String videoPath, String message, String iconName, String color, boolean soundCar, boolean isQuestionCard, String questionText, String youtubeUrl) {
    this.id = id;
    this.time = time;
    this.title = title;
    this.place = place;
    this.surprise = surprise;
    this.photoPath = photoPath;
    this.videoPath = videoPath;
    this.message = message;
    this.iconName = iconName;
    this.color = color;
    this.soundCar = soundCar;
    this.isQuestionCard = isQuestionCard;
    this.questionText = questionText;
    this.youtubeUrl = youtubeUrl;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTime() {
    return time;
  }

  public void setTime(String time) {
    this.time = time;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getPlace() {
    return place;
  }

  public void setPlace(String place) {
    this.place = place;
  }

  public String getSurprise() {
    return surprise;
  }

  public void setSurprise(String surprise) {
    this.surprise = surprise;
  }

  public String getPhotoPath() {
    return photoPath;
  }

  public void setPhotoPath(String photoPath) {
    this.photoPath = photoPath;
  }

  public String getVideoPath() {
    return videoPath;
  }

  public void setVideoPath(String videoPath) {
    this.videoPath = videoPath;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getIconName() {
    return iconName;
  }

  public void setIconName(String iconName) {
    this.iconName = iconName;
  }

  public String getColor() {
    return color;
  }

  public void setColor(String color) {
    this.color = color;
  }

  public boolean isSoundCar() {
    return soundCar;
  }

  public void setSoundCar(boolean soundCar) {
    this.soundCar = soundCar;
  }

  public boolean isQuestionCard() {
    return isQuestionCard;
  }

  public void setQuestionCard(boolean questionCard) {
    isQuestionCard = questionCard;
  }

  public void setIsQuestionCard(boolean questionCard) {
    isQuestionCard = questionCard;
  }

  public String getQuestionText() {
    return questionText;
  }

  public void setQuestionText(String questionText) {
    this.questionText = questionText;
  }

  public String getYoutubeUrl() {
    return youtubeUrl;
  }

  public void setYoutubeUrl(String youtubeUrl) {
    this.youtubeUrl = youtubeUrl;
  }
}
