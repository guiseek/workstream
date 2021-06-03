import { WebrtcAudioElement } from './webrtc-audio.element';

declare global {
  interface HTMLElementTagNameMap {
    'webrtc-audio': WebrtcAudioElement;
  }

  interface HTMLElementEventMap {
    onClick: ElementClickEvent<WebrtcAudioElement>;
  }
}
