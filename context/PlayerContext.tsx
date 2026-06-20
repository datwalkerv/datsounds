"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { Track } from "@/types/track";

export interface LikedEntry {
  track: Track;
  savedAt: string; // ISO string
}

export interface DownloadedEntry {
  track: Track;
  downloadedAt: string; // ISO string
  stemType: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  playCount: number; // increments on every SET_TRACK to force audio reload even for same track
  likedIds: number[];
  downloadedIds: number[];
  likedEntries: LikedEntry[];
  downloadedEntries: DownloadedEntry[];
}

type PlayerAction =
  | { type: "SET_TRACK"; track: Track; queue?: Track[] }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "SEEK"; time: number }
  | { type: "SET_TIME"; time: number }
  | { type: "SET_DURATION"; duration: number }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_LIKE"; track: Track }
  | { type: "MARK_DOWNLOADED"; track: Track; stemType: string }
  | { type: "NEXT" }
  | { type: "PREV" }
  | {
      type: "HYDRATE";
      likedIds: number[];
      downloadedIds: number[];
      likedEntries: LikedEntry[];
      downloadedEntries: DownloadedEntry[];
    };

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  queue: [],
  playCount: 0,
  likedIds: [],
  downloadedIds: [],
  likedEntries: [],
  downloadedEntries: [],
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        likedIds: action.likedIds,
        downloadedIds: action.downloadedIds,
        likedEntries: action.likedEntries,
        downloadedEntries: action.downloadedEntries,
      };
    case "SET_TRACK": {
      const queue = action.queue ?? state.queue;
      return {
        ...state,
        currentTrack: action.track,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        queue,
        playCount: state.playCount + 1,
      };
    }
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "SEEK":
      return { ...state, currentTime: action.time };
    case "SET_TIME":
      return { ...state, currentTime: action.time };
    case "SET_DURATION":
      return { ...state, duration: action.duration };
    case "SET_VOLUME":
      return { ...state, volume: action.volume };
    case "TOGGLE_LIKE": {
      const { track } = action;
      const alreadyLiked = state.likedIds.includes(track.id);
      const newLikedIds = alreadyLiked
        ? state.likedIds.filter((id) => id !== track.id)
        : [...state.likedIds, track.id];
      const newEntries = alreadyLiked
        ? state.likedEntries.filter((e) => e.track.id !== track.id)
        : [...state.likedEntries, { track, savedAt: new Date().toISOString() }];
      saveToStorage("datsounds_liked", newLikedIds);
      saveToStorage("datsounds_liked_entries", newEntries);
      return { ...state, likedIds: newLikedIds, likedEntries: newEntries };
    }
    case "MARK_DOWNLOADED": {
      const { track, stemType } = action;
      const newIds = state.downloadedIds.includes(track.id)
        ? state.downloadedIds
        : [...state.downloadedIds, track.id];
      // Allow multiple stem downloads; deduplicate by track+stem
      const exists = state.downloadedEntries.some(
        (e) => e.track.id === track.id && e.stemType === stemType
      );
      const newEntries = exists
        ? state.downloadedEntries
        : [
            ...state.downloadedEntries,
            { track, downloadedAt: new Date().toISOString(), stemType },
          ];
      saveToStorage("datsounds_downloaded", newIds);
      saveToStorage("datsounds_downloaded_entries", newEntries);
      return { ...state, downloadedIds: newIds, downloadedEntries: newEntries };
    }
    case "NEXT": {
      if (!state.currentTrack || !state.queue.length) return state;
      const idx = state.queue.findIndex((t) => t.id === state.currentTrack!.id);
      const next = state.queue[(idx + 1) % state.queue.length];
      return {
        ...state,
        currentTrack: next,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        playCount: state.playCount + 1,
      };
    }
    case "PREV": {
      if (!state.currentTrack || !state.queue.length) return state;
      const idx = state.queue.findIndex((t) => t.id === state.currentTrack!.id);
      const prev =
        state.queue[(idx - 1 + state.queue.length) % state.queue.length];
      return {
        ...state,
        currentTrack: prev,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        playCount: state.playCount + 1,
      };
    }
    default:
      return state;
  }
}

interface PlayerContextValue {
  state: PlayerState;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  dispatch: React.Dispatch<PlayerAction>;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleLike: (track: Track) => void;
  markDownloaded: (track: Track, stemType: string) => void;
  next: () => void;
  prev: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    dispatch({
      type: "HYDRATE",
      likedIds: loadFromStorage<number[]>("datsounds_liked", []),
      downloadedIds: loadFromStorage<number[]>("datsounds_downloaded", []),
      likedEntries: loadFromStorage<LikedEntry[]>("datsounds_liked_entries", []),
      downloadedEntries: loadFromStorage<DownloadedEntry[]>(
        "datsounds_downloaded_entries",
        []
      ),
    });
  }, []);

  // When track changes OR playCount changes, always reload the audio from scratch
  // This ensures re-clicking the same song resets and replays it correctly
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;
    const src = state.currentTrack.stems.full.lqMp3Url;
    audio.src = src;
    audio.load();
    audio.currentTime = 0;
    if (state.isPlaying) {
      audio.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.playCount]);

  // Play/pause sync (for togglePlay button without track change)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;
    if (state.isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isPlaying]);

  // Volume sync
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = state.volume;
  }, [state.volume]);

  const playTrack = useCallback((track: Track, queue?: Track[]) => {
    dispatch({ type: "SET_TRACK", track, queue });
  }, []);

  const togglePlay = useCallback(() => {
    dispatch({ type: state.isPlaying ? "PAUSE" : "PLAY" });
  }, [state.isPlaying]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = time;
    dispatch({ type: "SEEK", time });
  }, []);

  const setVolume = useCallback((vol: number) => {
    dispatch({ type: "SET_VOLUME", volume: vol });
  }, []);

  const toggleLike = useCallback((track: Track) => {
    dispatch({ type: "TOGGLE_LIKE", track });
  }, []);

  const markDownloaded = useCallback((track: Track, stemType: string) => {
    dispatch({ type: "MARK_DOWNLOADED", track, stemType });
  }, []);

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV" }), []);

  return (
    <PlayerContext.Provider
      value={{
        state,
        audioRef,
        dispatch,
        playTrack,
        togglePlay,
        seek,
        setVolume,
        toggleLike,
        markDownloaded,
        next,
        prev,
      }}
    >
      {/* Single audio element for the whole app */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) =>
          dispatch({
            type: "SET_TIME",
            time: (e.target as HTMLAudioElement).currentTime,
          })
        }
        onDurationChange={(e) =>
          dispatch({
            type: "SET_DURATION",
            duration: (e.target as HTMLAudioElement).duration,
          })
        }
        onEnded={() => dispatch({ type: "NEXT" })}
        preload="metadata"
      />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
