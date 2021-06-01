import {
  css,
  html,
  listen,
  Connected,
  Component,
  Autonomous,
} from '@workstream/common/elements';

import './app.element.scss';

@Autonomous({
  selector: 'workstream-root',
  mode: 'open',
})
export class AppElement extends Component(HTMLElement) implements Connected {
  public static observed = [];

  @listen('web-button', 'onClick')
  onWebClick(evt: CustomEvent<string>) {
    console.log(evt);
  }

  styles = css`
    .gutter-left {
      margin-left: 9px;
    }

    .col-span-2 {
      grid-column: span 2;
    }

    .flex {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    header {
      background-color: #143055;
      color: white;
      padding: 5px;
      border-radius: 3px;
    }

    main {
      padding: 0 36px;
    }

    p {
      text-align: center;
    }

    h1 {
      text-align: center;
      margin-left: 18px;
      font-size: 24px;
    }

    h2 {
      text-align: center;
      font-size: 20px;
      margin: 40px 0 10px 0;
    }

    .resources {
      text-align: center;
      list-style: none;
      padding: 0;
      display: grid;
      grid-gap: 9px;
      grid-template-columns: 1fr 1fr;
    }

    .resource {
      color: #0094ba;
      height: 36px;
      background-color: rgba(0, 0, 0, 0);
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      padding: 3px 9px;
      text-decoration: none;
    }

    .resource:hover {
      background-color: rgba(68, 138, 255, 0.04);
    }

    pre {
      padding: 9px;
      border-radius: 4px;
      background-color: black;
      color: #eee;
    }

    details {
      border-radius: 4px;
      color: #333;
      background-color: rgba(0, 0, 0, 0);
      border: 1px solid rgba(0, 0, 0, 0.12);
      padding: 3px 9px;
      margin-bottom: 9px;
    }

    summary {
      cursor: pointer;
      outline: none;
      height: 36px;
      line-height: 36px;
    }

    .container {
      display: flex;
      /* justify-content: center; */
      margin: 100px 0 20px;
      gap: 10px;
    }
  `;

  template = html`
    <header class="flex">
      <h1>Welcome to ${this.title}!</h1>
    </header>
    <main>
      <h2>Next Steps</h2>
      <p>Here are some things you can do with Nx.</p>
      <div class="container">
        <web-button type="submit" value="123">
          <img slot="prefix" src="assets/cloud-download.svg" />
          <span>Small Button</span>
          <img slot="suffix" src="assets/arrow-forward.svg" />
        </web-button>
      </div>

      <details>
        <summary>Code</summary>
        <pre>
&lt;web-button type="submit" value="123">
  &lt;img slot="prefix" src="assets/cloud-download.svg" />
  &lt;span>Small Button</span>
  &lt;img slot="suffix" src="assets/arrow-forward.svg" />
&lt;/web-button>
</pre>
      </details>

      <div class="container">
        <web-button type="submit" class="filled" value="123">
          <span>Filled Button</span>
        </web-button>
      </div>
      <details>
        <summary>Code</summary>
        <pre>
&lt;web-button type="submit" class="filled" value="123">
  &lt;span>Filled Button&lt;/span>
&lt;/web-button>
</pre>
      </details>

      <div class="container">
        <web-button type="submit" class="ghost" value="123">
          <span>Ghost Button</span>
        </web-button>
      </div>
      <details>
        <summary>Code</summary>
        <pre>
&lt;web-button type="submit" class="ghost" value="123">
  &lt;span>Ghost Button&lt;/span>
&lt;/web-button>
</pre>
      </details>
      <ul class="resources">
        <li class="col-span-2">
          <a
            class="resource flex"
            href="https://nxplaybook.com/p/nx-workspaces"
          >
            Nx video course
          </a>
        </li>
      </ul>
    </main>
  `;

  connected() {
    const title = 'web-app';

    const webButton = this.shadowRoot.querySelector('web-button');
    console.log(webButton);
    // webButton.emitClick<string>(title)
    setTimeout(() => {
      webButton.emitClick<string>(title);
      setTimeout(() => {
        webButton.onClick.emit<string>(title);
      }, 3000);
    }, 3000);
  }
}
