import { ButtonElement } from './button-base';
import './button.types';

describe('commonButtons', () => {
  let button: ButtonElement;

  beforeEach(() => {
    button = document.createElement('web-button');
  });

  it('should work', async () => {
    await customElements.whenDefined('web-button');
    expect(button).toBeDefined();
  });
});
