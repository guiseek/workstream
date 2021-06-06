import { ContainedButtonElement } from './contained-button.element';

declare global {
  interface HTMLElementTagNameMap {
    'button[contained-button]': ContainedButtonElement;
  }
}
