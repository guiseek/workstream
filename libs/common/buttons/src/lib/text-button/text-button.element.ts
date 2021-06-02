import {
  css,
  BuiltIn,
  Component,
  html,
  Connected,
} from '@workstream/common/elements';

@BuiltIn({
  selector: 'text-button',
  extends: 'button',
})
export class TextButtonElement
  extends Component(HTMLButtonElement)
  implements Connected {
  static observed = ['size', 'content'];

  public size: ButtonSize = 'default';

  public content: ButtonContent = 'default';

  styles = css`
    button[is='text-button'] {
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10px 16px;

      border-width: 1px;
      border-style: solid;
      border-color: transparent;
      border-radius: 8px;

      font-size: calc(var(--manrope-button-font-size) * 1px);
      text-decoration: var(--manrope-button-text-decoration);
      font-family: var(--manrope-button-font-family);
      font-weight: var(--manrope-button-font-weight);
      font-style: var(--manrope-button-font-style);
      font-stretch: var(--manrope-button-font-stretch);
      letter-spacing: var(--manrope-button-letter-spacing);
      line-height: calc(var(--manrope-button-line-height) * 1px);
      text-transform: var(--manrope-button-text-case);
      transition: all 100ms ease-in-out;
    }

    button[is='text-button'] > * {
      order: 1;
      margin: 0 4px;
    }

    button[is='text-button'] > [slot='prefix'] {
      margin-left: 0;
      order: 0;
    }

    button[is='text-button'] > [slot='suffix'] {
      margin-right: 0;
      order: 2;
    }

    /* Size Medium */
    .medium,
    button[is='text-button'][size='medium'] {
      padding: 8px 12px;
    }

    /* Size Small */
    .small,
    button[is='text-button'][size='small'] {
      padding: 4px 8px;
    }

    /* ------- */

    /* Style Text */
    button[is='text-button'] {
      background: var(--white);
      border-color: transparent;
      color: var(--grey-05);
      fill: var(--grey-05);
      /* fill: var(--blue-04); */
    }

    /* Text Content OnHover */
    button[is='text-button']:hover {
      background-color: var(--grey-01);
      border-color: transparent;
      color: var(--black);
    }

    button[is='text-button']:disabled,
    button[is='text-button'].submit:disabled,
    button[is='text-button'].cancel:disabled,
    button[is='text-button'].delete:disabled {
      background-color: var(--white);
      border-color: var(--white);
      color: var(--grey-03);
      fill: var(--grey-03);
    }

    /* Text Content Submit */
    button[is='text-button'][type='submit'] bs-icon,
    button[is='text-button'][type='submit']:hover bs-icon {
      border-color: transparent;
      color: var(--green-05);
      fill: var(--green-05);
    }

    button[is='text-button'][type='submit'],
    button[is='text-button'][type='submit']:hover {
      border-color: transparent;
      color: var(--grey-04);
      fill: var(--grey-04);

    }

    button[is='text-button'].cancel bs-icon,
    button[is='text-button'].cancel:hover bs-icon {
      color: var(--red-04);
      fill: var(--red-04);
    }


    /* Text Content Cancel */
    button[is='text-button'].cancel,
    button[is='text-button'].cancel:hover {
      color: var(--grey-05);
      fill: var(--grey-05);
    }

    button[is='text-button'].delete bs-icon,
    button[is='text-button'].delete:hover bs-icon {
      color: var(--orange-04);
      fill: var(--orange-04);
    }

    /* Shaded Content Delete */
    button[is='text-button'].delete,
    button[is='text-button'].delete:hover {
      border-color: transparent;
      color: var(--grey-05);
      fill: var(--grey-05);
    }

    button[is='text-button'] bs-icon {
      color: var(--blue-05);
      fill: var(--blue-05);
    }
    /* Style Text */
    button[is='text-button'] {
      background-color: var(--white);
      backdrop-filter: blur(var(--background-blur-radius * 1px));
      /* Note: backdrop-filter has minimal browser support */

      border-color: transparent;
      color: var(--grey-05);
      fill: var(--grey-05);
    }
  `;
  connected(): void {
    // this.classList.add('text');
    // const x = 6;
    // const computed = getComputedStyle(this);
    // const logic = computed.getPropertyValue('--logic');
    // eval(logic);
  }
}
