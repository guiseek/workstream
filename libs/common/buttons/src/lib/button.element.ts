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
  static observed = ['id', 'value', 'role', 'type', 'disabled'];

  public id: string = `id_${NEXT_ID++}`;

  public value: string;

  public role: WebButtonRole = 'button';

  public type: WebButtonType = 'button';

  public disabled: boolean;

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

    :host(.filled) > button {
      background: #545d69;
      border-color: #545d69;
      color: #ffffff;
    }
    :host(.filled) ::slotted(*) {
      color: #ffffff;
    }

    :host(.ghost) > button {
      border-color: #545d69;
      background: transparent;
      color: #545d69;
    }
    :host(.ghost) ::slotted(*) {
      color: #545d69;
    }

    /* Borderless */
    :host(.borderless) > button {
      border-color: transparent;
      background: transparent;
      color: #545d69;
    }
    :host(.borderless) ::slotted(*) {
      color: #545d69;
    }

    /* Rounded */
    :host(.rounded) > button {
      border-radius: 32px;
      border-color: #545d69;
      background: #545d69;
      color: #ffffff;
    }
    :host(.rounded) ::slotted(*) {
      color: #ffffff;
    }

    /* Primary */
    :host(.primary) > button {
      border-color: #0b5fff;
      background: #0b5fff;
      color: #ffffff;
    }

    /* Hover */
    :host(.primary:hover) > button {
      /* Action Primary / Hover */
      background: #0053f0;
    }
    :host(.primary:hover) ::slotted(*) {
      color: #ffffff;
    }

    /* Disabled */
    :host(.primary[disabled]) > button {
      /* Action Primary / Disabled */
      background: rgba(11, 95, 255, 0.5);
      border-color: rgba(11, 95, 255, 0.5);
      /* Action Primary / Inverted */
      color: #ffffff;
    }
    :host(.primary[disabled]) > button ::slotted(*) {
      /* Action Primary / Inverted */
      color: #ffffff;
    }

    /* Active */
    :host(.primary:hover) > button:active,
    :host(.primary:hover) > button:focus {
      /* Action Primary / Active */
      background: #004ad7;
    }

    :host(.primary:hover) > button:active ::slotted(*),
    :host(.primary:hover) > button:focus ::slotted(*) {
      /* Action Primary / Inverted */
      color: #ffffff;
    }

    :host(.primary) ::slotted(*) {
      color: #ffffff;
    }

    /* Secondary */
    :host(.secondary) > button {
      border-color: #ebaf16;
      background: #ebaf16;
      color: #ffffff;
    }
    :host(.secondary) ::slotted(*) {
      color: #ffffff;
    }

    /* Neutral */
    :host(.neutral) > button {
      border-color: #9098a1;
      background: #9098a1;
      color: #ffffff;
    }
    :host(.neutral) ::slotted(*) {
      color: #ffffff;
    }
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
    console.log(this.getAttribute('disabled'));

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
