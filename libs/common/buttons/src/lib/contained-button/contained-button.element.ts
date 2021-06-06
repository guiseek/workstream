import { BuiltIn } from '@workstream/common/elements';
import { containedStyles } from './contained-button';

@BuiltIn({
  selector: 'contained-button',
  extends: 'button',
})
export class ContainedButtonElement extends HTMLButtonElement {
  static observed = ['size', 'content'];

  public size: ButtonSize = 'default';

  public content: ButtonContent = 'default';

  styles = containedStyles;
}
