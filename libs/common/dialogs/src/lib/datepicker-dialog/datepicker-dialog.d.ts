import { DatepickerDialogElement } from './datepicker-dialog.element';

declare global {
  interface HTMLElementTagNameMap {
    'datepicker-dialog': DatepickerDialogElement;
  }

  interface HTMLElementEventMap {
    onClick: ElementClickEvent<DatepickerDialogElement>;
  }
}
