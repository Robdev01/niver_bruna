package com.niverbruna.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.niverbruna.model.Card;
import com.niverbruna.model.RouteState;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class RouteService {
  private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
  private static final Path DATA_FILE = Path.of("backend", "data", "roteiro.json");
  private static final List<String> COLORS = List.of(
      "metallic-rose",
      "from-pink-300 to-rose-500",
      "from-fuchsia-300 to-pink-500",
      "from-rose-300 to-pink-600",
      "from-pink-400 to-red-500",
      "from-rose-200 to-fuchsia-500"
  );
  private static final List<String> ICONS = List.of("heart", "sparkles", "food", "gift", "music");

  private final ObjectMapper objectMapper;
  private RouteState state = defaultState();

  public RouteService(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @PostConstruct
  public synchronized void load() throws IOException {
    if (!Files.exists(DATA_FILE)) {
      save();
      return;
    }

    state = objectMapper.readValue(DATA_FILE.toFile(), RouteState.class);
    sortCards();
  }

  public synchronized RouteState getRoute() {
    sortCards();
    return copyOf(state);
  }

  public synchronized RouteState updateBirthdayDate(String birthdayDate) {
    state.setBirthdayDate(birthdayDate);
    saveUnchecked();
    return getRoute();
  }

  public synchronized RouteState addCard(Card card) {
    int index = state.getCards().size();
    card.setId(UUID.randomUUID().toString());
    card.setPlace(blankToDefault(card.getPlace(), "Surpresa"));
    card.setIconName(blankToDefault(card.getIconName(), ICONS.get(index % ICONS.size())));
    card.setColor(blankToDefault(card.getColor(), COLORS.get(index % COLORS.size())));

    state.getCards().add(card);
    sortCards();
    saveUnchecked();
    return getRoute();
  }

  public synchronized RouteState removeCard(String id) {
    state.getCards().removeIf(card -> card.getId().equals(id));
    saveUnchecked();
    return getRoute();
  }

  public synchronized RouteState reset() {
    state = defaultState();
    saveUnchecked();
    return getRoute();
  }

  private void saveUnchecked() {
    try {
      save();
    } catch (IOException error) {
      throw new IllegalStateException("Nao foi possivel salvar o roteiro", error);
    }
  }

  private void save() throws IOException {
    Files.createDirectories(DATA_FILE.getParent());
    objectMapper.writerWithDefaultPrettyPrinter().writeValue(DATA_FILE.toFile(), state);
  }

  private void sortCards() {
    state.getCards().sort(Comparator.comparing(Card::getTime));
  }

  private RouteState copyOf(RouteState source) {
    List<Card> cards = source.getCards().stream()
        .map(card -> new Card(
            card.getId(),
            card.getTime(),
            card.getTitle(),
            card.getPlace(),
            card.getSurprise(),
            card.getPhotoPath(),
            card.getVideoPath(),
            card.getMessage(),
            card.getIconName(),
            card.getColor(),
            card.isSoundCar(),
            card.isQuestionCard(),
            card.getQuestionText(),
            card.getYoutubeUrl()
        ))
        .toList();
    return new RouteState(source.getBirthdayDate(), new ArrayList<>(cards));
  }

  private RouteState defaultState() {
    return new RouteState(
        LocalDate.now(ZONE).toString(),
        new ArrayList<>(List.of(
            new Card("morning-love", "08:30", "Bom dia, meu amor", "Na nossa casa",
                "Cafe do jeitinho que voce gosta e uma cartinha minha.",
                "", "",
                "Comeca devagar: cafe, carinho e um pedacinho do meu coracao no papel.",
                "heart", COLORS.get(0), false),
            new Card("first-surprise", "11:00", "Uma saidinha nossa", "Um lugar especial",
                "Um passeio leve, daqueles que viram lembranca boa sem fazer esforco.",
                "", "",
                "Se arruma sem pressa. Eu so quero te ver feliz chegando la.",
                "sparkles", COLORS.get(1), false),
            new Card("birthday-lunch", "13:00", "Almoco de aniversario", "Reserva secreta",
                "Mesa guardada, brinde combinado e tempo so para a gente.",
                "", "",
                "Hoje o pedido principal e simples: voce sorrindo sem pressa.",
                "food", COLORS.get(2), false),
            new Card("sweet-break", "16:30", "Uma pausa doce", "Parada surpresa",
                "Uma sobremesa, umas fotos bonitas e uma coisinha que eu escolhi pensando em voce.",
                "", "",
                "Tem uma pausa no meio do dia porque voce merece carinho ate nos detalhes.",
                "gift", COLORS.get(3), true),
            new Card("night-party", "20:00", "Fechar o dia juntinhos", "Destino final",
                "Jantar, musica e aquele momento de olhar para voce e pensar: que sorte a minha.",
                "", "",
                "O fim do dia e nosso. Sem correria, sem barulho demais, so eu e voce.",
                "music", COLORS.get(4), false)
        ))
    );
  }

  private String blankToDefault(String value, String fallback) {
    return value == null || value.isBlank() ? fallback : value;
  }
}
