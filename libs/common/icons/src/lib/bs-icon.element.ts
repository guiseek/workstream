import { distinctUntilChanged, filter } from 'rxjs/operators';
import {
  css,
  html,
  Connected,
  Component,
  Autonomous,
} from '@workstream/common/elements';

@Autonomous({
  selector: 'bs-icon',
  mode: 'open',
})
export class BsIconElement extends Component(HTMLElement) implements Connected {
  static observed = ['href', 'icon', 'color', 'size'];

  public href: string = 'assets/icons/bs-icons.svg';
  public icon: string = '';

  public color: string;
  public size: string;

  styles = css`
    :host {
      display: flex;
      width: 24px;
      height: 24px;
    }
    svg {
      width: 24px;
      height: 24px;
      fill: var(--icon-color);
    }
  `;

  template = html` <svg><use xlink:href=""></use></svg> `;

  private use: SVGUseElement;

  connected() {
    this.use = this.shadowRoot.querySelector('use');
    this.setIcon(this.icon);
    this.state$.pipe(filter((state) => !!state)).subscribe((state = {}) => {
      if (state?.icon) {
        this.setIcon(state.icon);
      }
      console.log('state: ', state);
    });
  }

  setIcon(icon: string) {
    const href = `${this.href}#${icon}`;
    this.use.setAttribute('xlink:href', href);
  }
}
