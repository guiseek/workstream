import {
  css,
  html,
  event,
  listen,
  Emitter,
  Connected,
  Component,
  Autonomous,
} from '@workstream/common/elements';

@Autonomous({
  selector: 'info-card',
  mode: 'open',
})
export class InfoCardElement
  extends Component(HTMLElement)
  implements Connected {
  static observed = [];

  @event()
  onClick: Emitter<MouseEvent>;

  @listen('button', 'click')
  onClicked(event: EventWithTarget) {
    this.onClick.emit(event.target);
  }

  styles = css`
    :host {
      display: flex;
      flex-direction: column;
      padding: 0px;
      /* White */

      background: #ffffff;
      /* Grey / 02 */

      border-radius: 0px 0px 12px 12px;
      border: 1px solid #c0c0c0;
      box-sizing: border-box;
      border-radius: 12px;
    }

    ::slotted([slot='body']) {
      padding: 24px;
      display: flex;
      flex-direction: column;
      background: var(--white);
    }

    ::slotted([slot='actions']) {
      padding: 16px 12px;
      background: var(--light-grey);

      border-top: 1px solid var(--grey-02);
    }
  `;

  template = html`
    <slot name="body"></slot>
    <slot name="actions"></slot>
  `;

  connected() {}

  public emitClick<D = unknown>(detail: D) {
    this.onClick.emit(detail);
  }
}
