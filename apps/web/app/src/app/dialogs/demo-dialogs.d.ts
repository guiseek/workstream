import { DemoDialogsElement } from './demo-dialogs.element';

declare global {
  interface HTMLElementTagNameMap {
    'demo-dialogs': DemoDialogsElement;
  }

  interface HTMLElementEventMap {
    onClick: ElementClickEvent<DemoDialogsElement>;
  }
}
