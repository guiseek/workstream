import { ButtonsElement } from './buttons.element';

declare global {
  interface HTMLElementTagNameMap {
    'buttons': ButtonsElement;
  }

  interface HTMLElementEventMap {
    onClick: ElementClickEvent<ButtonsElement>;
  }
}
