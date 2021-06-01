/**
 * @todo remover exports sem quebrar os apps
 */
export declare global {
  export type EventWithTarget<E = Event, T = HTMLElement> = E & {
    target: T;
    currentTarget: T;
  };

  export type ElementClickEvent<
    E extends HTMLElement,
    D = unknown
  > = CustomEvent<D> & {
    target: E;
    currentTarget: E;
  };

  interface HTMLElementEventMap {
    onClick: ElementClickEvent;
  }
}
