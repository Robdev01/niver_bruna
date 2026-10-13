import React, { useState } from 'react';
import {
  Bell,
  CalendarHeart,
  ChevronRight,
  Clock,
  Eye,
  Gift,
  Heart,
  Image,
  Lock,
  MapPin,
  Music2,
  Send,
  Settings2,
  Trash2,
  Truck,
  Video,
  X,
  Youtube,
} from 'lucide-react';
import { API_BASE_URL } from './config.js';

const SOUND_CAR_AUDIO_URLS = [
  '/audio/Manoel Gomes - Meus Parabéns [Vídeo Oficial].mp4',
  '/parabens-galinha-pintadinha.mp3',
];

const gradientMap = {
  'metallic-rose':
    'linear-gradient(135deg, #fff1f7 0%, #f9a8d4 18%, #be185d 45%, #f472b6 68%, #fff7fb 100%)',
  'from-sky-300 to-rose-400': 'linear-gradient(135deg, #fbcfe8, #fb7185)',
  'from-pink-300 to-sky-400': 'linear-gradient(135deg, #f9a8d4, #e11d48)',
  'from-cyan-300 to-fuchsia-400': 'linear-gradient(135deg, #fbcfe8, #e879f9)',
  'from-rose-300 to-sky-400': 'linear-gradient(135deg, #fda4af, #db2777)',
  'from-blue-400 to-pink-400': 'linear-gradient(135deg, #f472b6, #be185d)',
  'from-violet-300 to-cyan-400': 'linear-gradient(135deg, #f0abfc, #fb7185)',
  'from-pink-300 to-rose-500': 'linear-gradient(135deg, #f9a8d4, #f43f5e)',
  'from-fuchsia-300 to-pink-500': 'linear-gradient(135deg, #f0abfc, #ec4899)',
  'from-rose-300 to-pink-600': 'linear-gradient(135deg, #fda4af, #db2777)',
  'from-rose-200 to-fuchsia-500': 'linear-gradient(135deg, #fecdd3, #d946ef)',
  'from-rose-400 to-fuchsia-500': 'linear-gradient(135deg, #fb7185, #d946ef)',
  'from-amber-300 to-orange-500': 'linear-gradient(135deg, #fcd34d, #f97316)',
  'from-emerald-300 to-teal-500': 'linear-gradient(135deg, #6ee7b7, #14b8a6)',
  'from-pink-400 to-red-500': 'linear-gradient(135deg, #f472b6, #ef4444)',
  'from-indigo-400 to-cyan-400': 'linear-gradient(135deg, #818cf8, #22d3ee)',
};

export function formatCountdown(ms) {
  if (ms <= 0) return 'liberado';

  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

export function getGradient(color) {
  return gradientMap[color] ?? gradientMap['metallic-rose'];
}

function resolveMediaUrl(path) {
  if (!path?.trim()) return '';
  const value = path.trim();

  if (/^(https?:)?\/\//.test(value) || value.startsWith('data:')) {
    return value;
  }

  if (value.startsWith('/media/')) {
    return `${API_BASE_URL}${value}`;
  }

  return value.startsWith('/') ? value : `${API_BASE_URL}/media/${value}`;
}

function normalizeYoutubeUrl(url) {
  const value = url?.trim();
  if (!value) return 'https://www.youtube.com/results?search_query=sim+eu+aceito';
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export function hasQuestionCard(event) {
  return Boolean(event.isQuestionCard || event.questionCard);
}

export function Shell({ now, children, compact = false }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff5fa] text-slate-950">
      <section className="relative isolate min-h-screen px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10">
          <div className="h-full bg-[radial-gradient(circle_at_18%_14%,rgba(249,168,212,.38),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(190,24,93,.24),transparent_29%),linear-gradient(135deg,#fff7fb_0%,#ffe4ef_43%,#fdf2f8_100%)]" />
          <div className="confetti-layer" />
        </div>

        <header className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="metallic-pink grid size-11 place-items-center rounded-full text-white shadow-xl shadow-rose-300">
              <CalendarHeart size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-600">
                So para ela
              </p>
              <h1 className="text-xl font-black leading-none sm:text-2xl">
                Dia da Bruna
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
           
            <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur sm:flex">
              <Clock size={16} />
              {now.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>
        </header>

        <div
          className={`mx-auto max-w-7xl gap-8 py-8 lg:py-10 ${
            compact
              ? 'grid lg:grid-cols-[0.78fr_1.22fr] lg:items-start'
              : 'grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center'
          }`}
        >
          {children}
        </div>
      </section>
    </main>
  );
}

export function ConnectionBanner({ message }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm font-bold leading-6 text-amber-900 shadow-sm">
      {message}
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-[1.75rem] border border-white/80 bg-white/60 p-6 text-sm font-bold text-slate-500 shadow-sm backdrop-blur sm:ml-16">
      Pegando o roteiro que voce deixou salvo...
    </div>
  );
}

export function EventCard({ event, onOpen, onRemove }) {
  const canRemove = typeof onRemove === 'function';
  const gradient = getGradient(event.color);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(event)}
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          keyEvent.preventDefault();
          onOpen?.(event);
        }
      }}
      className={`group relative overflow-hidden rounded-[1.75rem] border p-5 shadow-xl transition duration-500 sm:ml-16 sm:p-6 ${
        event.unlocked
          ? 'cursor-pointer border-white bg-white/85 shadow-rose-200/70 backdrop-blur hover:-translate-y-1'
          : 'cursor-pointer border-white/70 bg-white/45 shadow-slate-200/60 backdrop-blur-md hover:-translate-y-1'
      }`}
    >
      <div
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ backgroundImage: gradient }}
      />
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-white/45" />

      <div className="flex gap-4">
        <div
          className="metallic-pink relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg"
        >
          {event.unlocked ? <Heart size={26} /> : <Lock size={24} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-sm font-black text-white">
              <Clock size={14} />
              {event.time}
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              {event.unlocked ? 'Aberto' : formatCountdown(event.remaining)}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
            {event.unlocked ? event.title : 'Surpresa guardada'}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-500">
            <MapPin size={15} />
            <span className="truncate">{event.unlocked ? event.place : 'Ainda e segredo'}</span>
          </div>

          <p
            className={`mt-4 text-base leading-7 transition ${
              event.unlocked ? 'text-slate-700' : 'select-none blur-sm text-slate-500'
            }`}
          >
            {event.unlocked
              ? event.message
              : 'Ainda nao da para espiar. Espera so mais um pouquinho.'}
          </p>

          {event.unlocked && (
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-rose-600">
              Abrir <ChevronRight size={16} />
            </div>
          )}
          {event.unlocked && event.soundCar && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-700">
              <Truck size={14} />
              Tem carro de som
            </div>
          )}
          {event.unlocked && hasQuestionCard(event) && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-pink-700">
              <Heart size={14} fill="currentColor" />
              Tem pedido
            </div>
          )}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={(clickEvent) => {
              clickEvent.stopPropagation();
              onRemove(event.id);
            }}
            className="absolute right-4 top-4 z-20 grid size-10 shrink-0 place-items-center rounded-full border border-rose-100 bg-white/95 text-rose-600 shadow-lg shadow-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-500 hover:text-white"
            aria-label={`Remover ${event.title}`}
            title="Remover"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
    </article>
  );
}

export function EventModal({ event, onClose }) {
  const [showQuestion, setShowQuestion] = useState(false);
  const Icon = event.icon ?? Gift;
  const isUnlocked = event.unlocked;
  const surprise = event.surprise?.trim() || 'A surpresa aparece aqui quando voce cadastrar esse detalhe.';
  const gradient = getGradient(event.color);
  const photoUrl = resolveMediaUrl(event.photoPath);
  const videoUrl = resolveMediaUrl(event.videoPath);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Momento ${event.title}`}
      onClick={onClose}
    >
      <div
        className="relative max-h-[min(88vh,46rem)] w-full max-w-2xl overflow-auto rounded-[2rem] border border-white/80 bg-white p-5 shadow-2xl shadow-rose-950/30 sm:p-7"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-rose-100 hover:text-rose-700"
          aria-label="Fechar detalhes"
          title="Fechar"
        >
          <X size={20} />
        </button>

        <div className="pr-12">
          <div
            className="grid size-16 place-items-center rounded-3xl text-white shadow-xl"
            style={{ backgroundImage: gradient }}
          >
            {isUnlocked ? <Icon size={30} /> : <Lock size={28} />}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-sm font-black text-white">
              <Clock size={14} />
              {event.time}
            </span>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rose-700">
              {isUnlocked ? 'Aberto' : formatCountdown(event.remaining)}
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
            {isUnlocked ? event.title : 'Surpresa guardada'}
          </h2>
        </div>

        {isUnlocked ? (
          <div className="mt-6 space-y-4">
            {(photoUrl || videoUrl) && (
              <MediaGallery photoUrl={photoUrl} videoUrl={videoUrl} />
            )}
            <ModalSection icon={Heart} title="Bilhete">
              {event.message}
            </ModalSection>
            <ModalSection icon={Gift} title="O que tem aqui">
              {surprise}
            </ModalSection>
            {hasQuestionCard(event) && (
              <section className="metallic-panel rounded-[1.5rem] border border-pink-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="metallic-pink grid size-12 shrink-0 place-items-center rounded-2xl text-white">
                    <Heart size={22} fill="currentColor" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-pink-700">
                      Chamada especial
                    </p>
                    <h3 className="mt-2 text-2xl font-black leading-tight text-slate-950">
                      Tem uma pergunta esperando por voce
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowQuestion(true)}
                      className="metallic-button mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-white shadow-lg shadow-rose-300 transition hover:-translate-y-0.5"
                    >
                      <Heart size={18} fill="currentColor" />
                      Ir para o pedido
                    </button>
                  </div>
                </div>
              </section>
            )}
            {event.soundCar && (
              <ModalSection icon={Truck} title="Carro de som">
                Nessa parte, vale fazer barulho e brincar um pouco.
              </ModalSection>
            )}
            <ModalSection icon={MapPin} title="Onde">
              {event.place || 'Surpresa'}
            </ModalSection>
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">
                  Ainda nao, meu amor
                </h3>
                <p className="mt-2 leading-7 text-slate-600">
                  Esse aqui eu deixei para abrir as {event.time}. Prometo que
                  vale esperar.
                </p>
              </div>
            </div>
          </div>
        )}
        {showQuestion && (
          <QuestionModal
            event={event}
            onClose={() => setShowQuestion(false)}
          />
        )}
      </div>
    </div>
  );
}

function QuestionModal({ event, onClose }) {
  const [noPosition, setNoPosition] = useState({ left: 66, top: 52 });
  const question =
    event.questionText?.trim() ||
    'Bruna, aceita ir comigo para a proxima surpresa?';

  function runAway() {
    setNoPosition({
      left: 8 + Math.floor(Math.random() * 64),
      top: 34 + Math.floor(Math.random() * 42),
    });
  }

  function openYesVideo() {
    window.location.href = normalizeYoutubeUrl(event.youtubeUrl);
  }

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/70 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Pedido para a Bruna"
      onClick={onClose}
    >
      <div
        className="relative min-h-[26rem] w-full max-w-xl overflow-hidden rounded-[2rem] border border-pink-100 bg-white p-6 shadow-2xl shadow-rose-950/30 sm:p-8"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full bg-pink-50 text-pink-700 transition hover:bg-pink-100"
          aria-label="Voltar"
          title="Voltar"
        >
          <X size={20} />
        </button>

        <div className="metallic-shine absolute inset-x-0 top-0 h-2" />
        <div className="relative pr-10">
          <div className="metallic-pink grid size-16 place-items-center rounded-3xl text-white shadow-xl shadow-rose-300">
            <Heart size={30} fill="currentColor" />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-pink-700">
            So vale responder com o coracao
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            {question}
          </h2>
          <p className="mt-4 text-lg font-medium leading-8 text-slate-700">
            Eu deixei duas opcoes, mas uma delas e meio dificil de pegar.
          </p>
        </div>

        <div className="relative mt-8 h-32 rounded-[1.5rem] border border-pink-100 bg-pink-50/70">
          <button
            type="button"
            onClick={openYesVideo}
            className="metallic-button absolute left-5 top-1/2 inline-flex h-12 -translate-y-1/2 items-center justify-center gap-2 rounded-full px-7 text-sm font-black text-white shadow-xl shadow-rose-300 transition hover:-translate-y-[54%]"
          >
            <Youtube size={19} />
            Sim
          </button>
          <button
            type="button"
            onMouseEnter={runAway}
            onFocus={runAway}
            onClick={runAway}
            onTouchStart={runAway}
            className="absolute inline-flex h-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-pink-200 bg-white px-7 text-sm font-black text-pink-700 shadow-lg shadow-rose-100 transition-all duration-200 hover:bg-pink-50"
            style={{ left: `${noPosition.left}%`, top: `${noPosition.top}%` }}
          >
            Nao
          </button>
        </div>
      </div>
    </div>
  );
}

function MediaGallery({ photoUrl, videoUrl }) {
  return (
    <section className="space-y-3">
      {photoUrl && (
        <div className="overflow-hidden rounded-[1.5rem] border border-pink-100 bg-pink-50">
          <div className="flex items-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-pink-700">
            <Image size={16} />
            Foto
          </div>
          <img
            src={photoUrl}
            alt="Foto desse momento"
            className="max-h-[26rem] w-full object-contain"
            loading="lazy"
          />
        </div>
      )}

      {videoUrl && (
        <div className="overflow-hidden rounded-[1.5rem] border border-rose-100 bg-rose-50">
          <div className="flex items-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-rose-700">
            <Video size={16} />
            Video
          </div>
          <video
            src={videoUrl}
            className="max-h-[28rem] w-full bg-slate-950"
            controls
            playsInline
          />
        </div>
      )}
    </section>
  );
}

export function WelcomeModal({ onClose }) {
  const [hideForever, setHideForever] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/60 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Mensagem antes de abrir"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/80 bg-white p-6 shadow-2xl shadow-rose-950/30 sm:p-8">
        <div className="absolute -right-16 -top-16 size-40 rounded-full bg-pink-200/60" />
        <div className="absolute -bottom-20 -left-14 size-44 rounded-full bg-rose-200/70" />

        <div className="relative">
          <div className="metallic-pink grid size-14 place-items-center rounded-3xl text-white shadow-xl shadow-rose-200">
            <Heart size={26} fill="currentColor" />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-rose-600">
            Antes de comecar
          </p>
          <h2 className="mt-2 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            Bruna, fiz isso pensando em você.
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-slate-700">
            Hoje não será possivel entender tudo de uma vez. Vai abrindo cada card no
            horário certo e deixa o resto comigo que vou cuidar dos detalhes. 
            Eu só quero que esse seu dia seja especial e que você aproveite bastante com esse seu sorriso maravilhoso.
          </p>
           <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-rose-600">
            Antes de começar clique no carro de som e aguarde a <strong> surpresa</strong>
          </p>

          <label className="mt-6 flex items-start gap-3 rounded-2xl border border-pink-100 bg-pink-50/80 px-4 py-3 text-sm font-bold leading-6 text-slate-700">
            <input
              type="checkbox"
              checked={hideForever}
              onChange={(event) => setHideForever(event.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-rose-400"
            />
            Nao mostrar essa mensagem de novo neste celular
          </label>

          <button
            type="button"
            onClick={() => onClose(hideForever)}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-rose-500 sm:w-auto"
          >
            <Send size={18} />
            Abrir o dia
          </button>
        </div>
      </div>
    </div>
  );
}

export function CelebrationOverlay() {
  const pieces = Array.from({ length: 34 }, (_, index) => ({
    id: index,
    left: 8 + ((index * 23) % 84),
    delay: (index % 9) * 0.07,
    duration: 1.7 + (index % 5) * 0.16,
    color: index % 2 === 0 ? '#be185d' : '#fb7185',
    size: 7 + (index % 4) * 3,
  }));

  const bursts = [
    { left: '22%', top: '28%' },
    { left: '72%', top: '22%' },
    { left: '50%', top: '42%' },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            '--left': `${piece.left}%`,
            '--delay': `${piece.delay}s`,
            '--duration': `${piece.duration}s`,
            '--color': piece.color,
            '--size': `${piece.size}px`,
          }}
        />
      ))}
      {bursts.map((burst, index) => (
        <span
          key={index}
          className="firework-burst"
          style={{ left: burst.left, top: burst.top }}
        />
      ))}
    </div>
  );
}

export function SoundCarParade() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] overflow-hidden">
      <div className="sound-car">
        <div className="sound-car-speaker">
          <Music2 size={22} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-700">
            Carro de som
          </p>
          <p className="text-sm font-black text-slate-950">
            Bruna, olha essa parte aqui!
          </p>
        </div>
        <div className="sound-car-heart">
          <Heart size={18} fill="currentColor" />
        </div>
      </div>
    </div>
  );
}

export function playOpenSound() {
  playToneSequence([
    { frequency: 660, start: 0, duration: 0.12, volume: 0.08 },
    { frequency: 880, start: 0.11, duration: 0.14, volume: 0.08 },
    { frequency: 1320, start: 0.23, duration: 0.18, volume: 0.07 },
  ]);
}

function playSoundCarJingle(index = 0) {
  const url = SOUND_CAR_AUDIO_URLS[index];

  if (!url) {
    playFallbackSoundCarJingle();
    return;
  }

  const audio = new Audio(encodeURI(url));
  audio.volume = 0.9;
  audio.currentTime = 0;

  audio.play().catch(() => {
    playSoundCarJingle(index + 1);
  });
}

function playFallbackSoundCarJingle() {
  playToneSequence([
    { frequency: 392, start: 0, duration: 0.18, volume: 0.09 },
    { frequency: 523, start: 0.16, duration: 0.18, volume: 0.09 },
    { frequency: 659, start: 0.32, duration: 0.22, volume: 0.08 },
    { frequency: 523, start: 0.58, duration: 0.22, volume: 0.08 },
  ]);
}

function playToneSequence(notes) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.75;
  master.connect(context.destination);

  notes.forEach((note) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = note.frequency;

    const start = context.currentTime + note.start;
    const end = start + note.duration;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(note.volume, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start);
    oscillator.stop(end + 0.03);
  });

  window.setTimeout(() => context.close(), 1300);
}

export function triggerSoundCar(setSoundCar) {
  playSoundCarJingle();
  setSoundCar(true);
  window.setTimeout(() => setSoundCar(false), 5200);
}

function ModalSection({ children, icon: Icon, title }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
        <Icon size={17} />
        {title}
      </div>
      <p className="mt-3 whitespace-pre-wrap text-lg font-semibold leading-8 text-slate-800">
        {children}
      </p>
    </section>
  );
}

export function Toast({ toast, onClose }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[min(calc(100%-2rem),34rem)] -translate-x-1/2 rounded-3xl border border-white/80 bg-slate-950 p-4 text-white shadow-2xl shadow-rose-300/60 sm:bottom-8">
      <div className="flex gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-500">
          <Bell size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black">{toast.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 font-black transition hover:bg-white/20"
          aria-label="Fechar mensagem"
        >
          x
        </button>
      </div>
    </div>
  );
}

export async function requestBrowserNotifications() {
  if (!('Notification' in window)) {
    alert('Este navegador nao suporta notificacoes.');
    return;
  }

  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}
