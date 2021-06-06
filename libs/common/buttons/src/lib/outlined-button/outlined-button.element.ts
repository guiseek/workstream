import { BuiltIn } from '@workstream/common/elements';
import { outlinedStyles } from './outlined-button';

@BuiltIn({
  selector: 'outlined-button',
  extends: 'button',
})
export class OutlinedButtonElement extends HTMLButtonElement {
  static observed = ['size', 'content'];

  public size: ButtonSize = 'default';

  public content: ButtonContent = 'default';

  styles = outlinedStyles;
}
