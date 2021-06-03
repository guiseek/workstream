import { css, BuiltIn, Component } from '@workstream/common/elements';

@BuiltIn({
  selector: 'outlined-button',
  extends: 'button',
})
export class OutlinedButtonElement extends Component(HTMLButtonElement) {
  static observed = ['size', 'content'];

  public size: ButtonSize = 'default';

  public content: ButtonContent = 'default';

  styles = css`
    button[is='outlined-button'] {
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

    button[is='outlined-button'] > * {
      order: 1;
      margin: 0 4px;
    }

    button[is='outlined-button'] > [slot='prefix'] {
      margin-left: 0;
      order: 0;
    }

    button[is='outlined-button'] > [slot='suffix'] {
      margin-right: 0;
      order: 2;
    }

    /* Size Medium */
    .medium,
    button[is='outlined-button'][size='medium'] {
      padding: 8px 12px;
    }

    /* Size Small */
    .small,
    button[is='outlined-button'][size='small'] {
      padding: 4px 8px;
    }
    /* Style Outlined */
    button[is='outlined-button'] {
      background: var(--white);
      border-color: var(--grey-02);
      color: var(--blue-05);
      fill: var(--blue-05);
    }

    /* Outlined Content Submit */
    button[is='outlined-button'][type='submit'],
    button[is='outlined-button'][type='submit']:hover {
      border-color: var(--grey-02);
      color: var(--green-05);
    }

    /* Outlined Content Cancel */
    button[is='outlined-button'].cancel,
    button[is='outlined-button'].cancel:hover {
      border-color: var(--grey-02);
      color: var(--red-05);
    }

    /* Outlined Content Delete */
    button[is='outlined-button'].delete,
    button[is='outlined-button'].delete:hover {
      border-color: var(--grey-02);
      color: var(--orange-05);
    }

    button[is='outlined-button']:hover {
      border-color: var(--grey-03);
      color: var(--blue-06);

      filter: drop-shadow(
        calc(var(--shadow-grey-4dp-0-offset-x) * 1px)
          calc(var(--shadow-grey-4dp-0-offset-y) * 1px)
          calc(var(--shadow-grey-4dp-0-radius) * 1px)
          var(--shadow-grey-4dp-0-color)
      );
    }

    button[is='outlined-button']:disabled,
    button[is='outlined-button'].submit:disabled,
    button[is='outlined-button'].cancel:disabled,
    button[is='outlined-button'].delete:disabled {
      border-color: var(--grey-02);
      color: var(--grey-03);
      filter: none;
    }
  `;
}
