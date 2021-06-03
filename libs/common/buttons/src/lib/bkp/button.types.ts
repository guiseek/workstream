import { WebButtonElement } from './button.element';

declare global {
  interface HTMLElementTagNameMap {
    'bkp-button': WebButtonElement;
  }

  type WebButtonType = 'button' | 'submit' | 'reset' | 'menu';
  type WebButtonRole =
    | 'option'
    | 'button'
    | 'menuitem'
    | 'menuitemcheckbox'
    | 'menuitemradio'
    | 'spinbutton'
    | 'switch';

  interface HTMLElementEventMap {
    onClick: ElementClickEvent<WebButtonElement>;
  }
}
