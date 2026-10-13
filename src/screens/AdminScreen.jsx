import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Eye,
  Image,
  Plus,
  RotateCcw,
  Settings2,
  Truck,
  Video,
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
  requestBrowserNotifications,
  triggerSoundCar,
} from '../shared.jsx';

export function AdminScreen({
  birthdayDate,
  draft,
  error,
  events,
  loading,
  now,
  savingCard,
  toast,
  onAddEvent,
  onChangeDate,
  onChangeDraft,
  onCloseToast,
  showWelcome,
  onCloseWelcome,
  onRemoveEvent,
  onReset,
  onUploadMedia,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [soundCar, setSoundCar] = useState(false);

  function openEvent(event) {
    const previewEvent = { ...event, unlocked: true };
    setSelectedEvent(previewEvent);

    playOpenSound();
    setCelebration({ id: `${previewEvent.id}-${Date.now()}` });
    window.setTimeout(() => setCelebration(null), 2400);

    if (previewEvent.soundCar) {
      triggerSoundCar(setSoundCar);
    }
  }

  return (
    <Shell now={now} compact>
      <section className="space-y-6">
        {error && <ConnectionBanner message={error} />}
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-4 py-2 text-sm font-bold text-pink-700 shadow-sm backdrop-blur">
          <Settings2 size={16} />
          Bastidores
        </div>

        <div>
          <h2 className="max-w-3xl text-4xl font-black leading-[0.95] text-slate-950 sm:text-6xl">
            Aqui voce prepara tudo escondidinho.
          </h2>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-700">
            Coloque os horarios, os lugares e as frases do seu jeito. Na outra
            tela, ela ve so a parte bonita.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="#/roteiro"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-rose-600"
          >
            <Eye size={18} />
            Ver roteiro
          </a>
          <button
            type="button"
            onClick={requestBrowserNotifications}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-rose-200 bg-white/80 px-5 text-sm font-black text-rose-700 shadow-sm transition hover:bg-white sm:col-span-2"
          >
            <Bell size={18} />
            Deixar os avisos ligados
          </button>
          <button
            type="button"
            onClick={() => triggerSoundCar(setSoundCar)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-pink-200 bg-white/80 px-5 text-sm font-black text-pink-700 shadow-sm transition hover:bg-white"
          >
            <Truck size={18} />
            Passar o carro
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 text-sm font-black text-slate-800 shadow-sm transition hover:bg-white"
          >
            <RotateCcw size={18} />
            Voltar ao comeco
          </button>
        </div>

        <PlannerPanel
          birthdayDate={birthdayDate}
          draft={draft}
          saving={savingCard}
          onAdd={onAddEvent}
          onChangeDate={onChangeDate}
          onChangeDraft={onChangeDraft}
          onUploadMedia={onUploadMedia}
        />
      </section>

      <section className="relative">
        <div className="mb-4 flex items-center justify-between gap-3 rounded-[1.25rem] border border-white/80 bg-white/70 px-5 py-4 shadow-sm backdrop-blur">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Roteiro de hoje
            </p>
            <h3 className="text-2xl font-black">{events.length} horarios</h3>
          </div>
          <Clock className="text-rose-500" size={26} />
        </div>
        <div className="space-y-4">
          {loading && <LoadingCard />}
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={{ ...event, unlocked: true }}
              onOpen={openEvent}
              onRemove={onRemoveEvent}
            />
          ))}
        </div>
      </section>

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

function PlannerPanel({
  birthdayDate,
  draft,
  saving,
  onAdd,
  onChangeDate,
  onChangeDraft,
  onUploadMedia,
}) {
  const [uploading, setUploading] = useState(null);

  async function handleMediaUpload(file, field) {
    if (!file) return;

    setUploading(field);
    const result = await onUploadMedia(file);
    setUploading(null);

    if (result?.path) {
      onChangeDraft({ ...draft, [field]: result.path });
    }
  }

  return (
    <form
      onSubmit={onAdd}
      className="relative z-10 rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-xl shadow-rose-200/60 backdrop-blur sm:ml-16"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-600">
            Novo pedacinho do dia
          </p>
          <h3 className="mt-1 text-2xl font-black">Guardar uma coisa</h3>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr]">
        <label className="space-y-1 text-sm font-bold text-slate-600">
          Dia
          <input
            type="date"
            value={birthdayDate}
            onChange={(event) => onChangeDate(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-rose-400"
          />
        </label>
        <label className="space-y-1 text-sm font-bold text-slate-600">
          Hora
          <input
            type="time"
            required
            value={draft.time}
            onChange={(event) =>
              onChangeDraft({ ...draft, time: event.target.value })
            }
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-rose-400"
          />
        </label>
        <label className="space-y-1 text-sm font-bold text-slate-600">
          Nome desse momento
          <input
            type="text"
            required
            value={draft.title}
            onChange={(event) =>
              onChangeDraft({ ...draft, title: event.target.value })
            }
            placeholder="Ex: Cinema juntinhos"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-rose-400"
          />
        </label>
        <label className="space-y-1 text-sm font-bold text-slate-600">
          Onde vai ser
          <input
            type="text"
            value={draft.place}
            onChange={(event) =>
              onChangeDraft({ ...draft, place: event.target.value })
            }
            placeholder="Ex: Ainda e segredo"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-rose-400"
          />
        </label>
      </div>

      <label className="mt-3 block space-y-1 text-sm font-bold text-slate-600">
        O que ela vai descobrir
        <textarea
          value={draft.surprise}
          onChange={(event) =>
            onChangeDraft({ ...draft, surprise: event.target.value })
          }
          placeholder="Ex: O presente, a reserva, a pista do proximo lugar..."
          rows="3"
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-950 outline-none transition focus:border-rose-400"
        />
      </label>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <MediaUploadField
          accept="image/*"
          icon={Image}
          label="Subir foto"
          path={draft.photoPath}
          uploading={uploading === 'photoPath'}
          onChange={(file) => handleMediaUpload(file, 'photoPath')}
        />
        <MediaUploadField
          accept="video/*"
          icon={Video}
          label="Subir video"
          path={draft.videoPath}
          uploading={uploading === 'videoPath'}
          onChange={(file) => handleMediaUpload(file, 'videoPath')}
        />
      </div>

      <label className="mt-3 block space-y-1 text-sm font-bold text-slate-600">
        Bilhete que aparece na hora
        <textarea
          required
          value={draft.message}
          onChange={(event) =>
            onChangeDraft({ ...draft, message: event.target.value })
          }
          placeholder="Escreva como voce falaria para ela..."
          rows="3"
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-950 outline-none transition focus:border-rose-400"
        />
      </label>

      <label className="mt-4 flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-sm font-black text-pink-800">
        <input
          type="checkbox"
          checked={draft.soundCar}
          onChange={(event) =>
            onChangeDraft({ ...draft, soundCar: event.target.checked })
          }
          className="size-5 accent-pink-500"
        />
        Nesse momento eu quero passar o carro de som
      </label>

      <div className="mt-4 rounded-[1.5rem] border border-pink-200 bg-pink-50/80 p-4">
        <label className="flex items-center gap-3 text-sm font-black text-pink-900">
          <input
            type="checkbox"
            checked={draft.isQuestionCard}
            onChange={(event) =>
              onChangeDraft({ ...draft, isQuestionCard: event.target.checked })
            }
            className="size-5 accent-pink-500"
          />
          Esse card vira o pedido com Sim e Nao
        </label>

        {draft.isQuestionCard && (
          <div className="mt-4 space-y-3">
            <label className="block space-y-1 text-sm font-bold text-slate-600">
              Pergunta do pedido
              <textarea
                value={draft.questionText}
                onChange={(event) =>
                  onChangeDraft({ ...draft, questionText: event.target.value })
                }
                placeholder="Ex: Bruna, aceita ir comigo para a proxima surpresa?"
                rows="2"
                className="w-full resize-none rounded-xl border border-pink-200 bg-white px-3 py-3 text-slate-950 outline-none transition focus:border-pink-400"
              />
            </label>
            <label className="block space-y-1 text-sm font-bold text-slate-600">
              Link do YouTube para abrir no Sim
              <input
                type="url"
                value={draft.youtubeUrl}
                onChange={(event) =>
                  onChangeDraft({ ...draft, youtubeUrl: event.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className="h-11 w-full rounded-xl border border-pink-200 bg-white px-3 text-slate-950 outline-none transition focus:border-pink-400"
              />
            </label>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={saving || uploading !== null}
        className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:translate-y-0"
      >
        <Plus size={18} />
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}

function MediaUploadField({ accept, icon: Icon, label, onChange, path, uploading }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm font-bold text-slate-600 transition hover:border-pink-200 hover:bg-white">
      <span className="flex items-center gap-2">
        <Icon size={17} />
        {label}
      </span>
      <input
        type="file"
        accept={accept}
        onChange={(event) => onChange(event.target.files?.[0])}
        className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-rose-500"
      />
      <span className="mt-3 block min-h-5 break-all text-xs font-semibold leading-5 text-slate-500">
        {uploading ? 'Subindo arquivo...' : path || 'Nenhum arquivo enviado ainda'}
      </span>
    </label>
  );
}
