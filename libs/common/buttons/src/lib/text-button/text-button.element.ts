import { BuiltIn } from '@workstream/common/elements';
import { textStyles } from './text-button';

@BuiltIn({
  selector: 'text-button',
  extends: 'button',
})
export class TextButtonElement extends HTMLButtonElement {
  static observed = ['size', 'content'];

  public size: ButtonSize = 'default';

  public content: ButtonContent = 'default';

  styles = textStyles;
}
