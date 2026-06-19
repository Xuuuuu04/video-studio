import { useEffect } from "react";
import type { ChapterDef } from "../registry/types";
import type { StepperState } from "./useStepper";
import type { PlaybackMode } from "./useAudioPlayer";

interface Options {
  stepper: StepperState;
  mode: PlaybackMode;
  autoStarted: boolean;
  cycleMode: () => void;
  setAutoStarted: (v: boolean) => void;
  chapters: ChapterDef[];
}

/**
 * Centralized keyboard handling for the presentation.
 *
 *   • Space       — auto mode + not started  → start auto playback
 *                   auto mode + running       → advance one step
 *                   manual / audio mode       → advance one step
 *   • ArrowRight  — advance
 *   • ArrowLeft   — go back
 *   • M           — cycle playback mode (manual → audio → auto → manual)
 *   • Home / End  — jump to first / last step
 *
 * Ignores key events whose target is an input / textarea / contenteditable,
 * so typing into a form field never hijacks navigation.
 */
export function useKeyboard({
  stepper,
  mode,
  autoStarted,
  cycleMode,
  setAutoStarted,
}: Options) {
  useEffect(() => {
    const isEditable = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (el.isContentEditable) return true;
      return false;
    };

    const handler = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;

      switch (e.key) {
        case " ":
        case "Spacebar":
          e.preventDefault();
          if (mode === "auto" && !autoStarted) {
            setAutoStarted(true);
          } else {
            stepper.next();
          }
          break;
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          stepper.next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          stepper.prev();
          break;
        case "Home":
          e.preventDefault();
          stepper.jumpToGlobal(0);
          break;
        case "End":
          e.preventDefault();
          stepper.jumpToGlobal(stepper.totalGlobal - 1);
          break;
        case "m":
        case "M":
          e.preventDefault();
          cycleMode();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stepper, mode, autoStarted, cycleMode, setAutoStarted]);
}
