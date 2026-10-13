import React, { useState } from 'react';
import {
  Bell,
  Check,
  Heart,
  PartyPopper,
  Star,
  Truck,
} from 'lucide-react';
import {
  CelebrationOverlay,
  ConnectionBanner,
  EventCard,
  EventModal,
  LoadingCard,
  Shell,
  SoundCarParade,
  Toast,
  WelcomeModal,
  playOpenSound,
  triggerSoundCar,
} from '../shared.jsx';

export function ViewerScreen({
  currentEvent,
  events,
  error,
  loading,
  nextEvent,
  now,
  toast,
  unlockedCount,
  onCloseToast,
  showWelcome,
  onCloseWelcome,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [soundCar, setSoundCar] = useState(false);

  function openEvent(event) {
    setSelectedEvent(event);

    if (!event.unlocked) return;

    playOpenSound();
    setCelebration({ id: `${event.id}-${Date.now()}` });
    window.setTimeout(() => setCelebration(null), 2400);

    if (event.soundCar) {
      triggerSoundCar(setSoundCar);
    }
  }

  return (
    <Shell now={now}>
      <section className="space-y-7">
        {error && <ConnectionBanner message={error} />}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-sm font-bold text-rose-700 shadow-sm backdrop-blur">
          <PartyPopper size={16} />
          Abre um pedacinho por vez
        </div>

        <div>
          <h2 className="max-w-3xl text-5xl font-black leading-[0.9] text-slate-950 sm:text-7xl lg:text-8xl">
            Bruna, <strong>Te amo!</strong>
          </h2>
          <h2 className="max-w-3xl text-5xl font-black leading-[0.9] text-slate-950 sm:text-7xl lg:text-8xl">
           Mas vai abrindo com calma.
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-700">
            Deixei algumas coisas guardadas para aparecerem no horario certo.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatusPill
            label="Ja abriu"
            value={`${unlockedCount}/${events.length}`}
            icon={Check}
          />
          <StatusPill
            label="Daqui a pouco"
            value={nextEvent ? nextEvent.time : 'Final'}
            icon={Bell}
          />
          <StatusPill
            label="Agora"
            value={currentEvent ? currentEvent.title : 'Em breve'}
            icon={Star}
          />
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-2xl shadow-rose-200/70 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-pink-200">
                Bilhete de agora
              </p>
              <h3 className="mt-2 text-2xl font-black">
                {currentEvent ? currentEvent.title : 'Ainda não chegou'}
              </h3>
            </div>
            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-slate-950">
              <Heart size={22} fill="currentColor" />
            </div>
          </div>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            {currentEvent
              ? currentEvent.message
              : 'Calma. Eu prometo que tem coisa boa vindo.'}
          </p>
        </div>
      </section>

      <section className="relative">
        <div className="absolute left-7 top-6 bottom-6 hidden w-1 rounded-full bg-white/80 sm:block" />
        <div className="space-y-4">
          {loading && <LoadingCard />}
          {events.map((event) => (
            <EventCard key={event.id} event={event} onOpen={openEvent} />
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => triggerSoundCar(setSoundCar)}
        className="metallic-button fixed bottom-5 right-5 z-40 inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-white shadow-xl shadow-rose-300/60 transition hover:-translate-y-0.5"
      >
        <Truck size={18} />
        Passar o carro
      </button>
      {celebration && <CelebrationOverlay key={celebration.id} />}
      {soundCar && <SoundCarParade />}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      {toast && <Toast toast={toast} onClose={onCloseToast} />}
      {showWelcome && <WelcomeModal onClose={onCloseWelcome} />}
    </Shell>
  );
}

function StatusPill({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
        <Icon size={16} />
        {label}
      </div>
      <p className="mt-2 truncate text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}
