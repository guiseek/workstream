import {
  css,
  event,
  listen,
  Emitter,
  Connected,
  Component,
  Autonomous,
} from '@workstream/common/elements';

@Autonomous({
  selector: 'demo-dialogs',
  mode: 'open',
})
export class DemoDialogsElement
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

  `;

  // template = html` <datepicker-dialog></datepicker-dialog> `;

  connected() {}

  public emitClick<D = unknown>(detail: D) {
    this.onClick.emit(detail);
  }
}
