import { TextButtonElement } from './text-button.element';

declare global {
  interface HTMLElementTagNameMap {
    'text-button': TextButtonElement;
  }

  type ButtonSize = 'default' | 'medium' | 'small';
  type ButtonContent =
    | 'default'
    | 'add'
    | 'back'
    | 'calendar'
    | 'cancel'
    | 'delete'
    | 'disabled'
    | 'edit'
    | 'expand'
    | 'menu'
    | 'more'
    | 'next'
    | 'onhover'
    | 'open'
    | 'submit';
}
