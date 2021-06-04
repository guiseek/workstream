import { CardsElement } from './cards.element';

declare global {
  interface HTMLElementTagNameMap {
    'demo-cards': CardsElement;
  }

  interface HTMLElementEventMap {
    onClick: ElementClickEvent<CardsElement>;
  }
}
