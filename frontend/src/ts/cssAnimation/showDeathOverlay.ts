import { createApp } from "vue";
import gsap from "gsap";
import DeathOverlay from "@/components/DeathOverlay.vue";
import { GAME_MODE } from "../_enum/gameMode";

let overlayApp: any = null;
let overlayEl: HTMLDivElement | null = null;

export function showDeathOverlay(gameMode: GAME_MODE) {
  if (overlayApp) return;

  overlayEl = document.createElement("div");
  overlayEl.id = "death-overlay-root";
  document.body.appendChild(overlayEl);

  overlayApp = createApp(DeathOverlay, {
    gameMode,
    onClose: hideDeathOverlay,
  });

  overlayApp.mount(overlayEl);

  gsap.fromTo(
    overlayEl,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: "power2.out" }
  );
}

function hideDeathOverlay() {
  if (!overlayEl) return;

  gsap.to(overlayEl, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      overlayApp?.unmount();
      overlayApp = null;

      overlayEl?.remove();
      overlayEl = null;
    },
  });
}