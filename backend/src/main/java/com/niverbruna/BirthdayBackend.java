package com.niverbruna;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BirthdayBackend {
  public static void main(String[] args) {
    SpringApplication.run(BirthdayBackend.class, args);
  }
}
