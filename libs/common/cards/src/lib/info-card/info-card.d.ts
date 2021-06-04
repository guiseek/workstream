import { InfoCardElement } from './info-card.element';

declare global {
  interface HTMLElementTagNameMap {
    'info-card': InfoCardElement;
  }

  interface HTMLElementEventMap {
    onClick: ElementClickEvent<InfoCardElement>;
  }
}
