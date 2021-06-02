import { css, html, Autonomous, BuiltIn, Component } from './core';
import { cloneTemplate } from './core/utilities';

@Autonomous({
  selector: 'autonomous-test',
  mode: 'open',
})
class AutonomousElement extends Component(HTMLElement) {
  connected() {}
}

@BuiltIn({
  selector: 'built-in-test',
  extends: 'button',
})
class BuiltInElement extends Component(HTMLButtonElement) {
  connected() {}
}

declare global {
  interface HTMLElementTagNameMap {
    'autonomous-test': AutonomousElement;
    'button[built-in-test]': BuiltInElement;
  }
}

describe('Common Elements', () => {
  let autonomousTest: AutonomousElement;
  let builtInTest: BuiltInElement;

  beforeEach(() => {
    autonomousTest = document.createElement('autonomous-test');
    builtInTest = document.createElement('button', {
      is: 'built-in-test',
    }) as BuiltInElement;
  });

  it('should css return ok', () => {
    expect(css``).toBeTruthy();
  });

  it('should css return HTMLStyleElement', () => {
    expect(css``).toBeInstanceOf(HTMLStyleElement);
  });

  it('should html return ok', () => {
    expect(html``).toBeTruthy();
  });

  it('should html return HTMLTemplateElement', () => {
    expect(html``).toBeInstanceOf(HTMLTemplateElement);
  });

  it('should clone template as fragment', () => {
    const tmpl = document.createElement('template');
    const html = cloneTemplate(tmpl);
    expect(html).toBeInstanceOf(DocumentFragment);
  });

  it('mixin component selector static', async () => {
    expect(AutonomousElement.selector).toEqual('autonomous-test');
  });

  it('autonomous component', async () => {
    await customElements.whenDefined('autonomous-test');
    expect(autonomousTest).toBeInstanceOf(HTMLElement);
  });

  it('built in component', async () => {
    await customElements.whenDefined('built-in-test');
    expect(builtInTest).toBeInstanceOf(HTMLButtonElement);
  });

  it('should autonomous set and get State', async () => {
    await customElements.whenDefined('autonomous-test');
    autonomousTest.setState({ number: 0 });
    expect(autonomousTest.state).toStrictEqual({ number: 0 });
  });

  it('built in set and get State', async () => {
    await customElements.whenDefined('built-in-test');
    builtInTest.setState({ number: 1 });
    expect(builtInTest.state).toStrictEqual({ number: 1 });
  });
});
