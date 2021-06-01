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

let NEXT_ID = 0;

@Autonomous({
  selector: 'web-button',
  mode: 'open',
})
export class WebButtonElement
  extends Component(HTMLElement)
  implements Connected {
  static observed = ['id', 'value', 'role', 'type'];

  public id: string = `id_${NEXT_ID++}`;

  public value: string;

  public role: WebButtonRole = 'button';

  public type: WebButtonType = 'button';

  @event()
  onClick: Emitter<MouseEvent>;

  @listen('button', 'click')
  onClicked(event: EventWithTarget<MouseEvent, HTMLButtonElement>) {
    this.onClick.emit(event.currentTarget.value);
  }

  styles = css`
    :host {
      display: inline-flex;
      border-radius: 4px;
      overflow: hidden;
    }
    button {
      /* display: flex; */
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      transition: all 200ms ease-in-out;

      border-width: 2px;
      border-style: solid;
      border-color: #a5abb3;
      background: #a5abb3;
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
    }
    ::slotted(*) {
      margin: 0 4px;
      font-family: 'Source Sans Pro', sans-serif;
      display: inline-flex;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;

      /* identical to box
        height, or 143% */
      line-height: 20px;

      color: #09101d;
    }
    ::slotted([slot='prefix']) {
      margin-left: 0;
    }
    ::slotted([slot='suffix']) {
      margin-right: 0;
    }
    ::slotted(svg),
    ::slotted(img) {
      height: 16px;
      width: 16px;
    }

    :host(.filled) button {
      background: #545d69;
      border-color: #545d69;
    }
    :host(.filled) ::slotted(*) {
      color: #ffffff;
    }
    :host(.ghost) button {
      border-color: #545d69;
      background: transparent;
    }
    :host(.ghost) ::slotted(*) {
      color: #545d69;
  `;

  template = html`
    <button type="button">
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    </button>
  `;

  private _button: HTMLButtonElement;

  public getHtmlButton() {
    return this._button;
  }

  connected() {
    const button = this.shadowRoot.querySelector('button');
    this.setAttribute('role', this.role);
    this._initializeWithElement(button);
  }

  private _initializeWithElement(button: HTMLButtonElement) {
    if (this.type !== 'button') {
      button.setAttribute('type', this.type);
    }

    if (this.value) {
      button.setAttribute('value', this.value);
    }

    this._button = button;
  }

  public emitClick<D = unknown>(detail: D) {
    this.onClick.emit(detail);
  }
}
