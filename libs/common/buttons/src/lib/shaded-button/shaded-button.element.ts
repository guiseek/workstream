import { css, BuiltIn, Component } from '@workstream/common/elements';

@BuiltIn({
  selector: 'shaded-button',
  extends: 'button',
})
export class ShadedButtonElement extends Component(HTMLButtonElement) {
  static observed = ['size', 'content'];

  public size: ButtonSize = 'default';

  public content: ButtonContent = 'default';

  styles = css`
    button[is='shaded-button'] {
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

    button[is='shaded-button'] > * {
      order: 1;
      margin: 0 4px;
    }

    button[is='shaded-button'] > [slot='prefix'] {
      margin-left: 0;
      order: 0;
    }

    button[is='shaded-button'] > [slot='suffix'] {
      margin-right: 0;
      order: 2;
    }


    /* Size Medium */
    .medium,
    button[is='shaded-button'][size='medium'] {
      padding: 8px 12px;
    }

    /* Size Small */
    .small,
    button[is='shaded-button'][size='small'] {
      padding: 4px 8px;
    }

    button[is='shaded-button'] {
      color: var(--blue-05);
      fill: var(--blue-05);
    }

    /* Shared Content OnHover */
    button[is='shaded-button']:hover {
      background-color: var(--white);
      border-color: transparent;
      color: var(--blue-05);

      filter: drop-shadow(
        calc(var(--shadow-grey-4dp-0-offset-x) * 1px)
          calc(var(--shadow-grey-4dp-0-offset-y) * 1px)
          calc(var(--shadow-grey-4dp-0-radius) * 1px)
          var(--shadow-grey-4dp-0-color)
      );
    }

    button[is='shaded-button']:disabled,
    button[is='shaded-button'].submit:disabled,
    button[is='shaded-button'].cancel:disabled,
    button[is='shaded-button'].delete:disabled {
      background-color: var(--grey-01);
      border-color: var(--grey-01);
      color: var(--grey-03);
      filter: none;
    }

    /* Shared Content Submit */
    button[is='shaded-button'].submit,
    button[is='shaded-button'].submit:hover {
      border-color: transparent;
      color: var(--green-06);
      fill: var(--green-04);
    }

    /* Shared Content Cancel */
    button[is='shaded-button'].cancel,
    button[is='shaded-button'].cancel:hover {
      border-color: transparent;
      color: var(--red-06);
      fill: var(--red-04);
    }

    /* Shaded Content Delete */
    button[is='shaded-button'].delete,
    button[is='shaded-button'].delete:hover {
      border-color: transparent;
      color: var(--orange-06);
      fill: var(--orange-04);
    }
  `;
}
