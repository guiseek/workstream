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
  selector: 'demo-cards',
  mode: 'open',
})
export class CardsElement extends Component(HTMLElement) implements Connected {
  static observed = [];

  @event()
  onClick: Emitter<MouseEvent>;

  @listen('button', 'click')
  onClicked(event: EventWithTarget) {
    this.onClick.emit(event.target);
  }

  styles = css``;

  template = html`
    <info-card>
      <section slot="body">
        <h3>
          In occaecat sunt dolor sunt adipisicing in ea eiusmod amet anim
          laborum aliqua sunt.
        </h3>
        <p>
          Cillum sit consequat sit sunt officia culpa excepteur. Nisi pariatur
          consequat velit deserunt nisi culpa nostrud amet. Eiusmod qui dolore
          eiusmod do aliquip laboris reprehenderit incididunt ullamco ad dolore
          velit in.
        </p>
      </section>
      <footer slot="actions">
        <button is="outlined-button">Learn More</button>
        <button is="text-button">Not Interested</button>
      </footer>
    </info-card>
  `;

  connected() {}

  public emitClick<D = unknown>(detail: D) {
    this.onClick.emit(detail);
  }
}
