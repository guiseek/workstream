import { BuiltIn } from '@workstream/common/elements';
import { shadedStyles } from './shaded-button';

@BuiltIn({
  selector: 'shaded-button',
  extends: 'button',
})
export class ShadedButtonElement extends HTMLButtonElement {
  static observed = ['size', 'content'];

  public size: ButtonSize = 'default';

  public content: ButtonContent = 'default';

  styles = shadedStyles;
}
