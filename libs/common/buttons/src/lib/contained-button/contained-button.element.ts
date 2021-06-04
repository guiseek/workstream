import { css, BuiltIn, Component } from '@workstream/common/elements';

@BuiltIn({
  selector: 'contained-button',
  extends: 'button',
})
export class ContainedButtonElement extends Component(HTMLButtonElement) {
  static observed = ['size', 'content'];

  public size: ButtonSize = 'default';

  public content: ButtonContent = 'default';

  styles = css`
    button[is='contained-button'] {
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

    button[is='contained-button'] > * {
      order: 1;
      margin: 0 4px;
    }

    button[is='contained-button'] > [slot='prefix'] {
      margin-left: 0;
      order: 0;
    }

    button[is='contained-button'] > [slot='suffix'] {
      margin-right: 0;
      order: 2;
    }

    /* Size Medium */
    .medium,
    button[is='contained-button'][size='medium'] {
      padding: 8px 12px;
    }

    /* Size Small */
    .small,
    button[is='contained-button'][size='small'] {
      padding: 4px 8px;
    }

    /* Style Contained */
    button[is='contained-button'] {
      background: var(--blue-05);

      /* Background Blur */
      backdrop-filter: blur(var(--background-blur-radius * 1px));
      /* Note: backdrop-filter has minimal browser support */

      color: var(--blue-01);
      fill: var(--blue-01);
    }

    /* Contained Content OnHover */
    button[is='contained-button']:hover {
      background-color: var(--blue-04);
      border-color: transparent;
      color: var(--white);
      fill: var(--white);

      filter: drop-shadow(
        calc(var(--shadow-grey-4dp-0-offset-x) * 1px)
          calc(var(--shadow-grey-4dp-0-offset-y) * 1px)
          calc(var(--shadow-grey-4dp-0-radius) * 1px)
          var(--shadow-grey-4dp-0-color)
      );
    }

    button[is='contained-button']:disabled,
    button[is='contained-button'][type="submit"]:disabled,
    button[is='contained-button'].cancel:disabled,
    button[is='contained-button'].delete:disabled {
      background-color: var(--grey-04);
      border-color: var(--grey-04);
      color: var(--grey-02);
      fill: var(--white);
    }

    /* Shared Content Submit */
    button[is='contained-button'][type="submit"],
    button[is='contained-button'][type="submit"]:hover {
      border-color: transparent;
      color: var(--green-01);
      fill: var(--green-02);
    }

    /* Shared Content Cancel */
    button[is='contained-button'].cancel,
    button[is='contained-button'].cancel:hover {
      border-color: transparent;
      color: var(--red-01);
      fill: var(--red-02);
    }

    /* Shared Content Delete */
    button[is='contained-button'].delete,
    button[is='contained-button'].delete:hover {
      border-color: transparent;
      color: var(--orange-01);
      fill: var(--orange-02);
    }
  `;
}
