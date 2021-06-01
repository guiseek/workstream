/**
 * @internal
 * @interface Component
 */
export interface Component {
  is?: string
  selector: string

  template?: HTMLTemplateElement
  new (params: HTMLTemplateElement): HTMLTemplateElement

  styles?: HTMLStyleElement
  new (param: HTMLStyleElement): HTMLStyleElement

  observed?: string[]
  new (...params: string[]): string[]

  connected(): void
  disconnected(): void
  attributeChanged(name: string, prev: string, next: string): void
}
