import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Gift, Heart, Music2, Sparkles, Utensils } from 'lucide-react';
import { AdminScreen } from './screens/AdminScreen.jsx';
import { ViewerScreen } from './screens/ViewerScreen.jsx';
import { API_BASE_URL } from './config.js';
import './styles.css';

const defaultBirthdayDate = '2026-10-09';

const iconMap = {
  heart: Heart,
  sparkles: Sparkles,
  food: Utensils,
  gift: Gift,
  music: Music2,
};

const defaultSchedule = [
  {
    id: 'morning-love',
    time: '08:30',
    title: 'Bom dia, meu amor',
    place: 'Na nossa casa',
    surprise: 'Cafe do jeitinho que voce gosta e uma cartinha minha.',
    photoPath: '',
    videoPath: '',
    soundCar: false,
    message:
      'Comeca devagar: cafe, carinho e um pedacinho do meu coracao no papel.',
    iconName: 'heart',
    color: 'from-sky-300 to-rose-400',
  },
  {
    id: 'first-surprise',
    time: '11:00',
    title: 'Uma saidinha nossa',
    place: 'Um lugar especial',
    surprise: 'Um passeio leve, daqueles que viram lembranca boa sem fazer esforco.',
    photoPath: '',
    videoPath: '',
    soundCar: false,
    message:
      'Se arruma sem pressa. Eu so quero te ver feliz chegando la.',
    iconName: 'sparkles',
    color: 'from-pink-300 to-sky-400',
  },
  {
    id: 'birthday-lunch',
    time: '13:00',
    title: 'Almoco de aniversario',
    place: 'Reserva secreta',
    surprise: 'Mesa guardada, brinde combinado e tempo so para a gente.',
    photoPath: '',
    videoPath: '',
    soundCar: false,
    message:
      'Hoje o pedido principal e simples: voce sorrindo sem pressa.',
    iconName: 'food',
    color: 'from-cyan-300 to-fuchsia-400',
  },
  {
    id: 'sweet-break',
    time: '16:30',
    title: 'Uma pausa doce',
    place: 'Parada surpresa',
    surprise: 'Uma sobremesa, umas fotos bonitas e uma coisinha que eu escolhi pensando em voce.',
    photoPath: '',
    videoPath: '',
    soundCar: true,
    message:
      'Tem uma pausa no meio do dia porque voce merece carinho ate nos detalhes.',
    iconName: 'gift',
    color: 'from-rose-300 to-sky-400',
  },
  {
    id: 'night-party',
    time: '20:00',
    title: 'Fechar o dia juntinhos',
    place: 'Destino final',
    surprise: 'Jantar, musica e aquele momento de olhar para voce e pensar: que sorte a minha.',
    photoPath: '',
    videoPath: '',
    soundCar: false,
    message:
      'O fim do dia e nosso. Sem correria, sem barulho demais, so eu e voce.',
    iconName: 'music',
    color: 'from-blue-400 to-pink-400',
  },
];

const colorOptions = [
  'metallic-rose',
  'from-pink-300 to-rose-500',
  'from-fuchsia-300 to-pink-500',
  'from-rose-300 to-pink-600',
  'from-pink-400 to-red-500',
  'from-rose-200 to-fuchsia-500',
];

function getEventDate(date, time) {
  return new Date(`${date}T${time}:00`);
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function App() {
  const route = useHashRoute();
  const [now, setNow] = useState(() => new Date());
  const [toast, setToast] = useState(null);
  const [savingCard, setSavingCard] = useState(false);
  const [seenUnlocked, setSeenUnlocked] = useState(() => new Set());
  const [showWelcome, setShowWelcome] = useState(() => {
    return window.localStorage.getItem('bruna:hide-welcome') !== 'true';
  });
  const {
    birthdayDate,
    error,
    loading,
    plans,
    addCard,
    removeCard,
    resetRoute,
    uploadMedia,
    updateBirthdayDate,
  } = useBackendRoute();
  const [draft, setDraft] = useState({
    time: '21:30',
    title: '',
    place: '',
    surprise: '',
    photoPath: '',
    videoPath: '',
    soundCar: false,
    isQuestionCard: false,
    questionText: 'Bruna, aceita viver esse proximo momento comigo?',
    youtubeUrl: '',
    message: '',
  });

  const events = useMemo(
    () =>
      plans
        .slice()
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((item, index) => {
          const date = getEventDate(birthdayDate, item.time);
          const isBirthdayToday = getLocalDateKey(now) === birthdayDate;
          return {
            ...item,
            id: item.id ?? `${item.time}-${item.title}`,
            index,
            date,
            icon: iconMap[item.iconName] ?? Gift,
            unlocked: !loading && isBirthdayToday && now >= date,
            remaining: date.getTime() - now.getTime(),
          };
        }),
    [birthdayDate, loading, now, plans],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const source = new EventSource(`${API_BASE_URL}/api/notifications`);

    source.addEventListener('card-unlocked', (event) => {
      const payload = JSON.parse(event.data);
      setToast({
        title: payload.title,
        message: payload.message,
      });
      showBrowserNotification(payload.title, payload.message);
    });

    source.onerror = () => source.close();

    return () => source.close();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (getLocalDateKey(now) !== birthdayDate) return;

    const newlyUnlocked = events.find(
      (event) => event.unlocked && !seenUnlocked.has(event.id),
    );

    if (!newlyUnlocked) return;

    setSeenUnlocked((previous) => {
      const next = new Set(previous);
      next.add(newlyUnlocked.id);
      return next;
    });
    setToast({
      title: `${newlyUnlocked.time} liberou!`,
      message: newlyUnlocked.message,
    });

    const timeout = window.setTimeout(() => setToast(null), 9000);
    return () => window.clearTimeout(timeout);
  }, [birthdayDate, events, loading, now, seenUnlocked]);

  async function handleAddEvent(event) {
    event.preventDefault();

    if (!draft.time || !draft.title.trim() || !draft.message.trim()) {
      setToast({
        title: 'Faltou um detalhe',
        message: 'Preenche pelo menos a hora, o nome do momento e o bilhete.',
      });
      return;
    }

    if (draft.isQuestionCard && !draft.youtubeUrl.trim()) {
      setToast({
        title: 'Faltou o video',
        message: 'Coloca o link do YouTube para abrir quando ela clicar em sim.',
      });
      return;
    }

    const color = colorOptions[plans.length % colorOptions.length];
    const iconName = ['heart', 'sparkles', 'food', 'gift', 'music'][plans.length % 5];

    setSavingCard(true);
    const saved = await addCard({
      time: draft.time,
      title: draft.title.trim(),
      place: draft.place.trim() || 'Surpresa',
      surprise: draft.surprise.trim(),
      photoPath: draft.photoPath.trim(),
      videoPath: draft.videoPath.trim(),
      soundCar: draft.soundCar,
      isQuestionCard: draft.isQuestionCard,
      questionCard: draft.isQuestionCard,
      questionText: draft.questionText.trim(),
      youtubeUrl: draft.youtubeUrl.trim(),
      message: draft.message.trim(),
      iconName,
      color,
    });
    setSavingCard(false);

    if (!saved) {
      setToast({
        title: 'Nao consegui guardar',
        message: 'Confere se o backend esta ligado e tenta mais uma vez.',
      });
      return;
    }

    setDraft({
      time: '21:30',
      title: '',
      place: '',
      surprise: '',
      photoPath: '',
      videoPath: '',
      soundCar: false,
      isQuestionCard: false,
      questionText: 'Bruna, aceita viver esse proximo momento comigo?',
      youtubeUrl: '',
      message: '',
    });
  }

  async function removeEvent(id) {
    await removeCard(id);
  }

  async function resetPlans() {
    await resetRoute();
    setSeenUnlocked(new Set());
  }

  const sharedProps = {
    birthdayDate,
    currentEvent: [...events].reverse().find((event) => event.unlocked),
    events,
    error,
    loading,
    nextEvent: events.find((event) => !event.unlocked),
    now,
    toast,
    savingCard,
    unlockedCount: events.filter((event) => event.unlocked).length,
    onCloseToast: () => setToast(null),
    showWelcome,
    onCloseWelcome: (hideForever) => {
      if (hideForever) {
        window.localStorage.setItem('bruna:hide-welcome', 'true');
      }
      setShowWelcome(false);
    },
  };

  if (route === 'admin') {
    return (
      <AdminScreen
        {...sharedProps}
        draft={draft}
        onAddEvent={handleAddEvent}
        onChangeDate={updateBirthdayDate}
        onChangeDraft={setDraft}
        onRemoveEvent={removeEvent}
        onReset={resetPlans}
        onUploadMedia={uploadMedia}
      />
    );
  }

  return <ViewerScreen {...sharedProps} />;
}

function useHashRoute() {
  const [route, setRoute] = useState(() => getHashRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getHashRoute());
    window.addEventListener('hashchange', onHashChange);

    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/roteiro');
      setRoute('roteiro');
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}

function getHashRoute() {
  return window.location.hash.replace('#/', '') === 'admin'
    ? 'admin'
    : 'roteiro';
}

function useBackendRoute() {
  const [birthdayDate, setBirthdayDate] = useState(defaultBirthdayDate);
  const [plans, setPlans] = useState(defaultSchedule);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadRoute() {
    try {
      setLoading(true);
      const data = await request('/api/route');
      setBirthdayDate(data.birthdayDate);
      setPlans(data.cards);
      setError('');
    } catch {
      setError('Nao consegui falar com o backend agora. Confere se ele esta ligado na porta 7080.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoute();
  }, []);

  async function updateBirthdayDate(nextDate) {
    setBirthdayDate(nextDate);
    try {
      const data = await request('/api/route', {
        method: 'PUT',
        body: JSON.stringify({ birthdayDate: nextDate }),
      });
      setBirthdayDate(data.birthdayDate);
      setPlans(data.cards);
      setError('');
    } catch {
      setError('Nao consegui salvar a data. Tenta de novo em um instante.');
    }
  }

  async function addCard(card) {
    try {
      const data = await request('/api/cards', {
        method: 'POST',
        body: JSON.stringify(card),
      });
      setBirthdayDate(data.birthdayDate);
      setPlans(data.cards);
      setError('');
      return true;
    } catch {
      setError('Nao consegui guardar esse momento. Tenta de novo.');
      return false;
    }
  }

  async function removeCard(id) {
    try {
      const data = await request(`/api/cards/${id}`, { method: 'DELETE' });
      setBirthdayDate(data.birthdayDate);
      setPlans(data.cards);
      setError('');
    } catch {
      setError('Nao consegui apagar esse item agora.');
    }
  }

  async function resetRoute() {
    try {
      const data = await request('/api/route/reset', { method: 'POST' });
      setBirthdayDate(data.birthdayDate);
      setPlans(data.cards);
      setError('');
    } catch {
      setError('Nao consegui voltar o roteiro para o inicio.');
    }
  }

  async function uploadMedia(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/media`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      setError('');
      return response.json();
    } catch {
      setError('Nao consegui subir esse arquivo agora.');
      return null;
    }
  }

  return {
    birthdayDate,
    error,
    loading,
    plans,
    addCard,
    removeCard,
    resetRoute,
    uploadMedia,
    updateBirthdayDate,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }

  return response.json();
}

function showBrowserNotification(title, message) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  new Notification(title, {
    body: message,
  });
}

createRoot(document.getElementById('root')).render(<App />);
