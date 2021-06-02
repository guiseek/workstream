import { WebButtonElement } from './button.element';
import './button.types';

describe('commonButtons', () => {
  let button: WebButtonElement;

  beforeEach(() => {
    button = document.createElement('web-button');
  });

  it('should work', async () => {
    await customElements.whenDefined('web-button');
    expect(button).toBeDefined();
  });
});
