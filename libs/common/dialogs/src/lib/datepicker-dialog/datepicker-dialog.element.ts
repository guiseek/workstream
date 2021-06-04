import {
  css,
  html,
  event,
  listen,
  Emitter,
  Connected,
  Component,
  Autonomous,
  query,
} from '@workstream/common/elements';

@Autonomous({
  selector: 'datepicker-dialog',
  mode: 'open',
})
export class DatepickerDialogElement
  extends Component(HTMLElement)
  implements Connected {
  static observed = [];

  @event()
  onClick: Emitter<MouseEvent>;

  @listen('button', 'click')
  onClicked(event: EventWithTarget) {
    this.onClick.emit(event.target);
  }

  buttonLabelChoose = 'Choose Date';

  buttonLabelChange = 'Change Date';

  dayLabels = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];

  monthLabels = [
    'Janeira',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  messageCursorKeys: string;
  // messageCursorKeys = 'Use as teclas direcionais para navegar';

  lastMessage = '';

  @query('input[type="text"')
  textboxNode: HTMLInputElement;

  @listen('input[type="text"', 'blur')
  onTextBlur(event: FocusEvent) {
    console.log(event);
    this.setDateForButtonLabel();
  }

  @query('.group button')
  buttonNode: HTMLButtonElement;

  @listen('.group button', 'keydown')
  onKeydownButton(event: KeyboardEvent) {
    console.log(event);

    this.handleButtonKeydown(event);
  }

  @query('[role="dialog"]')
  dialogNode: HTMLDialogElement;

  @query('.dialog-message')
  messageNode: HTMLOutputElement;

  @query('.month-year')
  monthYearNode: HTMLButtonElement;

  @query('.prev-year')
  prevYearNode: HTMLButtonElement;

  @listen('.prev-year', 'click')
  onPrevYear(event: KeyboardEvent) {
    console.log(event instanceof KeyboardEvent);
    event.stopImmediatePropagation();
    this.handlePreviousYearButton(event);
  }

  @query('.prev-month')
  prevMonthNode: HTMLButtonElement;

  @listen('.prev-month', 'click')
  onPrevMonth(event: KeyboardEvent) {
    console.log(event);

    this.handlePreviousMonthButton(event);
  }

  @query('.next-month')
  nextMonthNode: HTMLButtonElement;

  @listen('.next-month', 'click')
  onNextMonth(event: KeyboardEvent) {
    console.log(event);

    this.handleNextMonthButton(event);
  }

  @query('.next-year')
  nextYearNode: HTMLButtonElement;

  @query('button[value="ok"]')
  okButtonNode: HTMLButtonElement;

  @query('button[value="cancel"]')
  cancelButtonNode: HTMLButtonElement;

  @query('table.dates tbody')
  tbodyNode: HTMLTableElement;

  lastRowNode = null;

  days = [];

  focusDay = new Date();

  selectedDay = new Date(0, 0, 1);

  isMouseDownOnBackground = false;

  styles = css`
    :host {
      display: flex;
      flex-direction: column;
      font-size: calc(var(--manrope-button-font-size) * 1px);
      text-decoration: var(--manrope-button-text-decoration);
      font-family: var(--manrope-button-font-family);
      font-style: var(--manrope-button-font-style);
      line-height: calc(var(--manrope-button-line-height) * 1px);
      background: var(--white);
      color: var(--grey-06);
    }
    .sr-only {
      position: absolute;
      top: -2000em;
      left: -3000em;
    }

    .datepicker {
      margin-top: 1em;
      position: relative;
    }

    .datepicker .group {
      display: inline-block;
      position: relative;
      width: 13em;
    }

    .datepicker label {
      display: block;
    }

    .datepicker input {
      padding: 0;
      margin: 0;
      height: 1.5em;
      /* background-color: white; */
      color: black;
      /* border: 1px solid gray; */
    }

    .datepicker button.icon {
      position: relative;
      top: 0.25em;
      margin: 0;
      padding: 4px;
      /* border: 0 solid #005a9c; */
      /* background-color: white; */
      /* border-radius: 5px; */
    }

    .datepicker .desc {
      position: absolute;
      left: 0;
      top: 2em;
    }

    .datepicker .fa-calendar-alt {
      /* color: hsl(216, 89%, 51%); */
    }

    .datepicker button.icon:focus {
      outline: none;
      padding: 2px;
      border-width: 2px;
      box-shadow: 0px 2px 4px var(--shadow-blue-4dp-0-color),
        0px 4px 8px var(--shadow-blue-4dp-0-color);
      /* background-color: #def; */
    }

    .datepicker input:focus {
      box-shadow: 0px 2px 4px var(--shadow-blue-4dp-0-color),
        0px 4px 8px var(--shadow-blue-4dp-0-color);
      /* background-color: #def; */
      /* outline: 2px solid #005a9c; */
      /* outline-offset: 1px; */
    }

    .datepicker-dialog {
      position: absolute;
      clear: both;
      margin-top: 0.15em;
      padding: 0;
      box-shadow: 0px 8px 16px 2px rgba(97, 97, 97, 0.1),
        0px 16px 32px 2px rgba(97, 97, 97, 0.1);
      overflow: hidden;
      border-radius: 12px;
      background: var(--white);
    }

    .datepicker-dialog .header {
      cursor: default;
      /* background-color: hsl(216, 80%, 51%); */
      /* color: white; */
      padding: 7px;
      height: 64px;
      font-weight: bold;
      color: var(--black);
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .datepicker-dialog h2 {
      margin: 0;
      padding: 0;
      display: inline-block;
      font-size: 1em;
      color: var(--black);
      text-transform: none;
      font-weight: bold;
    }

    .datepicker-dialog button {
      border-style: none;
      z-index: 10;
      /* background: transparent; */
    }

    .datepicker-dialog button::-moz-focus-inner {
      border: 0;
    }

    .datepicker-dialog .prev-year,
    .datepicker-dialog .prev-month,
    .datepicker-dialog .next-month,
    .datepicker-dialog .next-year {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      background: var(--light-blue);
      color: var(--grey-05);
      fill: var(--grey-05);
      outline: 0;
    }

    .datepicker-dialog .prev-year:focus,
    .datepicker-dialog .prev-month:focus,
    .datepicker-dialog .next-month:focus,
    .datepicker-dialog .next-year:focus {
      /* padding: 2px; */
      /* Blue / 03 */
      border: 1.5px solid var(--blue-03);
      /* outline: 0; */
    }

    .datepicker-dialog .prev-year:hover,
    .datepicker-dialog .prev-month:hover,
    .datepicker-dialog .next-month:hover,
    .datepicker-dialog .next-year:hover {
      padding: 3px;
      border: 1px solid white;
      border-radius: 4px;
    }

    .datepicker-dialog .dialog-ok-cancel-group {
      display: flex;
      justify-content: flex-end;
      text-align: right;
      margin-top: 1em;
      margin-bottom: 1em;
      margin-right: 1em;
    }

    .datepicker-dialog .dialog-ok-cancel-group button {
      padding: 6px;
      margin-left: 1em;
    }

    .datepicker-dialog table.dates {
      padding-left: 1em;
      padding-right: 1em;
      padding-top: 1em;
      margin: 16px;
      border-top: 1px solid var(--grey-01);
      border-bottom: 1px solid var(--grey-01);
    }

    .datepicker-dialog table.dates th,
    .datepicker-dialog table.dates td {
      text-align: center;
    }

    .datepicker-dialog table.dates th {
      color: var(--grey-04);
      font-weight: normal;
    }

    .datepicker-dialog table.dates tr {
      border: 1px solid black;
    }

    .datepicker-dialog table.dates td {
      padding: 3px;
      margin: 0;
      line-height: inherit;
      height: 40px;
      width: 40px;
      /* border-radius: 5px; */
      font-size: 15px;
      transition: background-color 300ms ease-in-out,
        border-color 100ms ease-in-out;
    }

    .datepicker-dialog table.dates td.disabled {
      padding: 2px;
      border: none;
      height: 41px;
      width: 41px;
    }

    .datepicker-dialog table.dates td {
      box-sizing: border-box;
      border-radius: 50%;
      color: var(--black);
    }
    .datepicker-dialog table.dates td:focus,
    .datepicker-dialog table.dates td:hover {
      padding: 0;
      background-color: var(--white);
      border: 1px solid var(--blue-03);
      box-sizing: border-box;
      border-radius: 50%;
      color: var(--blue-05);
    }

    .datepicker-dialog table.dates td:focus {
      padding: 1px;
      border: 1px solid var(--blue-03);
      outline: 0;
      box-shadow: 0px 2px 4px var(--shadow-blue-4dp-0-color),
        0px 4px 8px var(--shadow-blue-4dp-0-color);
    }

    .datepicker-dialog table.dates td:not(.disabled):hover {
      background-color: var(--light-blue);
      border: 1px solid var(--blue-03);
      padding: 2px;
    }

    .datepicker-dialog table.dates td[aria-selected] {
      padding: 1px;
      border: 1px solid var(--blue-03);
    }

    .datepicker-dialog table.dates td[aria-selected]:focus {
      padding: 1px;
      border: 2px solid rgb(100, 100, 100);
    }

    .datepicker-dialog table.dates td[tabindex='0'] {
      background-color: var(--light-purple);
      border: 1px solid var(--purple-01);
      box-sizing: border-box;
      border-radius: 50%;
      color: var(--purple-05);
      box-shadow: 0px 2px 4px var(--shadow-purple-4dp-0-color),
        0px 4px 8px var(--shadow-purple-4dp-0-color);
    }
    .datepicker-dialog table.dates td[tabindex='0']:hover {
      background-color: var(--light-purple);
      border: 1px solid var(--purple-01);
    }

    .datepicker-dialog .dialog-message:not(:empty) {
      height: 1.75em;
    }
    .datepicker-dialog .dialog-message {
      color: var(--blue-05);
      padding-top: 0.25em;
      padding-left: 1em;
      height: 0px;
    }
  `;

  template = html`
    <div id="myDatepicker" class="datepicker">
      <div class="date">
        <label for="id-textbox-1">Date</label>

        <div class="group">
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            id="id-textbox-1"
            aria-describedby="id-description-1"
          />
          <span class="desc" id="id-description-1">
            (<span class="sr-only">date format: </span>mm/dd/yyyy)
          </span>
          <button type="button" class="icon" aria-label="Choose Date">
            <bs-icon icon="calendar-today"></bs-icon>
          </button>
        </div>
      </div>

      <div
        id="id-datepicker-1"
        class="datepicker-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Choose Date"
      >
        <div class="header">
          <button
            is="text-button"
            type="button"
            class="prev-year"
            aria-label="previous year"
          >
            <!-- <span class="fas fa-angle-double-left fa-lg"></span> -->
            <bs-icon icon="chevron-left"></bs-icon>
          </button>

          <button
            is="shaded-button"
            type="button"
            class="prev-month"
            aria-label="previous month"
          >
            <!-- <span class="fas fa-angle-left fa-lg"></span> -->
            <bs-icon icon="chevron-left"></bs-icon>
          </button>

          <h2 id="id-grid-label" class="month-year" aria-live="polite">
            February 2020
          </h2>

          <button
            is="shaded-button"
            type="button"
            class="next-month"
            aria-label="next month"
          >
            <!-- <span class="fas fa-angle-right fa-lg"></span> -->
            <bs-icon icon="chevron-right"></bs-icon>
          </button>

          <button
            is="shaded-button"
            type="button"
            class="next-year"
            aria-label="next year"
          >
            <!-- <span class="fas fa-angle-double-right fa-lg"></span> -->
            <bs-icon icon="chevron-right"></bs-icon>
          </button>
        </div>

        <table class="dates" role="grid" aria-labelledby="id-grid-label">
          <thead>
            <tr>
              <th scope="col" abbr="Sunday">Su</th>
              <th scope="col" abbr="Monday">Mo</th>
              <th scope="col" abbr="Tuesday">Tu</th>
              <th scope="col" abbr="Wednesday">We</th>
              <th scope="col" abbr="Thursday">Th</th>
              <th scope="col" abbr="Friday">Fr</th>
              <th scope="col" abbr="Saturday">Sa</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="disabled" tabindex="-1"></td>
              <td class="disabled" tabindex="-1"></td>
              <td class="disabled" tabindex="-1"></td>
              <td class="disabled" tabindex="-1"></td>
              <td class="disabled" tabindex="-1"></td>
              <td class="disabled" tabindex="-1"></td>
              <td tabindex="-1" data-date="2020-02-01">1</td>
            </tr>
            <tr>
              <td tabindex="-1" data-date="2020-02-02">2</td>
              <td tabindex="-1" data-date="2020-02-03">3</td>
              <td tabindex="-1" data-date="2020-02-04">4</td>
              <td tabindex="-1" data-date="2020-02-05">5</td>
              <td tabindex="-1" data-date="2020-02-06">6</td>
              <td tabindex="-1" data-date="2020-02-07">7</td>
              <td tabindex="-1" data-date="2020-02-08">8</td>
            </tr>
            <tr>
              <td tabindex="-1" data-date="2020-02-09">9</td>
              <td tabindex="-1" data-date="2020-02-10">10</td>
              <td tabindex="-1" data-date="2020-02-11">11</td>
              <td tabindex="-1" data-date="2020-02-12">12</td>
              <td tabindex="-1" data-date="2020-02-13">13</td>
              <td
                tabindex="0"
                data-date="2020-02-14"
                role="gridcell"
                aria-selected="true"
              >
                14
              </td>
              <td tabindex="-1" data-date="2020-02-15">15</td>
            </tr>
            <tr>
              <td tabindex="-1" data-date="2020-02-16">16</td>
              <td tabindex="-1" data-date="2020-02-17">17</td>
              <td tabindex="-1" data-date="2020-02-18">18</td>
              <td tabindex="-1" data-date="2020-02-19">19</td>
              <td tabindex="-1" data-date="2020-02-20">20</td>
              <td tabindex="-1" data-date="2020-02-21">21</td>
              <td tabindex="-1" data-date="2020-02-22">22</td>
            </tr>
            <tr>
              <td tabindex="-1" data-date="2020-02-23">23</td>
              <td tabindex="-1" data-date="2020-02-24">24</td>
              <td tabindex="-1" data-date="2020-02-25">25</td>
              <td tabindex="-1" data-date="2020-02-26">26</td>
              <td tabindex="-1" data-date="2020-02-27">27</td>
              <td tabindex="-1" data-date="2020-02-28">28</td>
              <td tabindex="-1" data-date="2020-02-29">29</td>
            </tr>
            <tr>
              <td tabindex="-1" data-date="2020-02-30">30</td>
              <td tabindex="-1" data-date="2020-02-31">31</td>
              <td class="disabled" tabindex="-1"></td>
              <td class="disabled" tabindex="-1"></td>
              <td class="disabled" tabindex="-1"></td>
              <td class="disabled" tabindex="-1"></td>
              <td class="disabled" tabindex="-1"></td>
            </tr>
          </tbody>
        </table>

        <div class="dialog-ok-cancel-group">
          <!-- <button class="dialog-button" value="cancel">Cancel</button> -->
          <button value="cancel" is="outlined-button" class="dialog-button">
            <span>Cancel</span>
          </button>
          <button
            value="ok"
            type="submit"
            is="contained-button"
            class="dialog-button"
          >
            <bs-icon slot="prefix" icon="check"></bs-icon>
            <span>Done</span>
          </button>
          <!-- <button class="" value="ok">OK</button> -->
        </div>
        <div class="dialog-message" aria-live="polite"></div>
      </div>
    </div>
  `;

  connected() {
    queueMicrotask(() => this.init());
  }

  init() {
    console.log(this.textboxNode);

    // this.textboxNode.addEventListener(
    //   'blur',
    //   this.setDateForButtonLabel.bind(this)
    // );

    console.log(this.buttonNode);

    // this.buttonNode.addEventListener(
    //   'keydown',
    //   this.handleButtonKeydown.bind(this)
    // );
    console.log(this.buttonNode);

    this.buttonNode.addEventListener(
      'click',
      this.handleButtonClick.bind(this)
    );

    console.log(this.okButtonNode);

    this.okButtonNode.addEventListener('click', this.handleOkButton.bind(this));
    console.log(this.okButtonNode);

    this.okButtonNode.addEventListener(
      'keydown',
      this.handleOkButton.bind(this)
    );

    console.log(this.cancelButtonNode);

    this.cancelButtonNode.addEventListener(
      'click',
      this.handleCancelButton.bind(this)
    );
    console.log(this.cancelButtonNode);

    this.cancelButtonNode.addEventListener(
      'keydown',
      this.handleCancelButton.bind(this)
    );

    console.log(this.prevMonthNode);

    this.prevMonthNode.addEventListener(
      'click',
      this.handlePreviousMonthButton.bind(this)
    );
    console.log(this.nextMonthNode);

    // this.nextMonthNode.addEventListener(
    //   'click',
    //   this.handleNextMonthButton.bind(this)
    // );
    console.log(this.prevYearNode);

    // this.prevYearNode.addEventListener(
    //   'click',
    //   this.handlePreviousYearButton.bind(this)
    // );
    console.log(this.nextYearNode);

    this.nextYearNode.addEventListener(
      'click',
      this.handleNextYearButton.bind(this)
    );

    console.log(this.prevMonthNode);

    this.prevMonthNode.addEventListener(
      'keydown',
      this.handlePreviousMonthButton.bind(this)
    );
    console.log(this.nextMonthNode);

    this.nextMonthNode.addEventListener(
      'keydown',
      this.handleNextMonthButton.bind(this)
    );
    console.log(this.prevYearNode);

    this.prevYearNode.addEventListener(
      'keydown',
      this.handlePreviousYearButton.bind(this)
    );
    console.log(this.nextYearNode);

    this.nextYearNode.addEventListener(
      'keydown',
      this.handleNextYearButton.bind(this)
    );

    console.log(document.body);

    document.body.addEventListener(
      'mouseup',
      this.handleBackgroundMouseUp.bind(this),
      true
    );

    // Create Grid of Dates

    this.tbodyNode.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      let row = this.tbodyNode.insertRow(i);
      this.lastRowNode = row;
      for (let j = 0; j < 7; j++) {
        let cell = document.createElement('td');

        cell.tabIndex = -1;
        cell.addEventListener('click', this.handleDayClick.bind(this));
        cell.addEventListener('keydown', this.handleDayKeyDown.bind(this));
        cell.addEventListener('focus', this.handleDayFocus.bind(this));

        cell.textContent = '-1';

        row.appendChild(cell);
        this.days.push(cell);
      }
    }

    this.updateGrid();
    // this.close(false);
    this.setDateForButtonLabel();
  }

  isSameDay(day1: Date, day2: Date) {
    return (
      day1.getFullYear() == day2.getFullYear() &&
      day1.getMonth() == day2.getMonth() &&
      day1.getDate() == day2.getDate()
    );
  }

  isNotSameMonth(day1: Date, day2: Date) {
    return (
      day1.getFullYear() != day2.getFullYear() ||
      day1.getMonth() != day2.getMonth()
    );
  }

  updateGrid() {
    let flag: boolean;
    let fd = this.focusDay;

    this.monthYearNode.textContent =
      this.monthLabels[fd.getMonth()] + ' ' + fd.getFullYear();

    let firstDayOfMonth = new Date(fd.getFullYear(), fd.getMonth(), 1);
    let dayOfWeek = firstDayOfMonth.getDay();

    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - dayOfWeek);

    let d = new Date(firstDayOfMonth);

    for (let i = 0; i < this.days.length; i++) {
      flag = d.getMonth() != fd.getMonth();
      this.updateDate(
        this.days[i],
        flag,
        d,
        this.isSameDay(d, this.selectedDay)
      );
      d.setDate(d.getDate() + 1);

      // Hide last row if all dates are disabled (e.g. in next month)
      if (i === 35) {
        if (flag) {
          this.lastRowNode.style.visibility = 'hidden';
        } else {
          this.lastRowNode.style.visibility = 'visible';
        }
      }
    }
  }

  updateDate = function (
    domNode: HTMLElement,
    disable: boolean,
    day: Date,
    selected: boolean
  ) {
    let d = day.getDate().toString();
    if (day.getDate() <= 9) {
      d = '0' + d;
    }

    let m: number | string = day.getMonth() + 1;
    if (day.getMonth() < 9) {
      m = '0' + m;
    }

    domNode.tabIndex = -1;
    domNode.removeAttribute('aria-selected');
    domNode.setAttribute('data-date', day.getFullYear() + '-' + m + '-' + d);

    if (disable) {
      domNode.classList.add('disabled');
      domNode.textContent = '';
    } else {
      domNode.classList.remove('disabled');
      domNode.textContent = day.getDate() + '';
      if (selected) {
        domNode.setAttribute('aria-selected', 'true');
        domNode.tabIndex = 0;
      }
    }
  };

  moveFocusToDay(day: Date) {
    let d = this.focusDay;

    this.focusDay = day;

    if (
      d.getMonth() != this.focusDay.getMonth() ||
      d.getFullYear() != this.focusDay.getFullYear()
      // d.getYear() != this.focusDay.getYear()
    ) {
      this.updateGrid();
    }
    this.setFocusDay();
  }

  setFocusDay(flag?: boolean) {
    if (typeof flag !== 'boolean') {
      flag = true;
    }

    for (let i = 0; i < this.days.length; i++) {
      let dayNode = this.days[i];
      let day = this.getDayFromDataDateAttribute(dayNode);

      dayNode.tabIndex = -1;
      if (this.isSameDay(day, this.focusDay)) {
        dayNode.tabIndex = 0;
        if (flag) {
          dayNode.focus();
        }
      }
    }
  }

  open() {
    this.dialogNode.style.display = 'block';
    this.dialogNode.style.zIndex = 2 + '';

    this.getDateFromTextbox();
    this.updateGrid();
  }

  isOpen() {
    return window.getComputedStyle(this.dialogNode).display !== 'none';
  }

  close(flag?: boolean) {
    console.log('flag: ', flag);

    if (typeof flag !== 'boolean') {
      // Default is to move focus to combobox
      flag = true;
    }

    this.setMessage('');
    this.dialogNode.style.display = 'none';

    if (flag) {
      this.buttonNode.focus();
    }
  }

  moveToNextYear() {
    this.focusDay.setFullYear(this.focusDay.getFullYear() + 1);
    this.updateGrid();
  }

  moveToPreviousYear() {
    this.focusDay.setFullYear(this.focusDay.getFullYear() - 1);
    this.updateGrid();
  }

  moveToNextMonth() {
    this.focusDay.setMonth(this.focusDay.getMonth() + 1);
    this.updateGrid();
  }

  moveToPreviousMonth() {
    this.focusDay.setMonth(this.focusDay.getMonth() - 1);
    this.updateGrid();
  }

  moveFocusToNextDay() {
    let d = new Date(this.focusDay);
    d.setDate(d.getDate() + 1);
    this.moveFocusToDay(d);
  }

  moveFocusToNextWeek() {
    let d = new Date(this.focusDay);
    d.setDate(d.getDate() + 7);
    this.moveFocusToDay(d);
  }

  moveFocusToPreviousDay() {
    let d = new Date(this.focusDay);
    d.setDate(d.getDate() - 1);
    this.moveFocusToDay(d);
  }

  moveFocusToPreviousWeek() {
    let d = new Date(this.focusDay);
    d.setDate(d.getDate() - 7);
    this.moveFocusToDay(d);
  }

  moveFocusToFirstDayOfWeek() {
    let d = new Date(this.focusDay);
    d.setDate(d.getDate() - d.getDay());
    this.moveFocusToDay(d);
  }

  moveFocusToLastDayOfWeek() {
    let d = new Date(this.focusDay);
    d.setDate(d.getDate() + (6 - d.getDay()));
    this.moveFocusToDay(d);
  }

  isDayDisabled(domNode: HTMLElement) {
    return domNode.classList.contains('disabled');
  }

  getDayFromDataDateAttribute(domNode) {
    let parts = domNode.getAttribute('data-date').split('-');
    return new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
  }

  setTextboxDate(domNode?: HTMLElement) {
    let d = this.focusDay;

    if (domNode) {
      d = this.getDayFromDataDateAttribute(domNode);
      // updated aria-selected
      this.days.forEach((day) =>
        day === domNode
          ? day.setAttribute('aria-selected', 'true')
          : day.removeAttribute('aria-selected')
      );
    }

    this.textboxNode.value =
      d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
    this.setDateForButtonLabel();
  }

  getDateFromTextbox() {
    let parts = this.textboxNode.value.split('/');
    let month = parseInt(parts[0]);
    let day = parseInt(parts[1]);
    let year = parseInt(parts[2]);

    if (
      parts.length === 3 &&
      Number.isInteger(month) &&
      Number.isInteger(day) &&
      Number.isInteger(year)
    ) {
      if (year < 100) {
        year = 2000 + year;
      }
      this.focusDay = new Date(year, month - 1, day);
      this.selectedDay = new Date(this.focusDay);
    } else {
      // If not a valid date (MM/DD/YY) initialize with todays date
      this.focusDay = new Date();
      this.selectedDay = new Date(0, 0, 1);
    }
  }

  setDateForButtonLabel() {
    let parts = this.textboxNode.value.split('/');

    if (
      parts.length === 3 &&
      Number.isInteger(parseInt(parts[0])) &&
      Number.isInteger(parseInt(parts[1])) &&
      Number.isInteger(parseInt(parts[2]))
    ) {
      let day = new Date(
        parseInt(parts[2]),
        parseInt(parts[0]) - 1,
        parseInt(parts[1])
      );

      let label = this.buttonLabelChange;
      label += ', ' + this.dayLabels[day.getDay()];
      label += ' ' + this.monthLabels[day.getMonth()];
      label += ' ' + day.getDate();
      label += ', ' + day.getFullYear();
      this.buttonNode.setAttribute('aria-label', label);
    } else {
      // If not a valid date, initialize with "Choose Date"
      this.buttonNode.setAttribute('aria-label', this.buttonLabelChoose);
    }
  }

  setMessage(str: string) {
    function setMessageDelayed() {
      this.messageNode.textContent = str;
    }

    if (str !== this.lastMessage) {
      setTimeout(setMessageDelayed.bind(this), 200);
      this.lastMessage = str;
    }
  }

  handleOkButton(event: KeyboardEvent) {
    let flag = false;

    switch (event.type) {
      case 'keydown':
        switch (event.key) {
          case 'Tab':
            if (!event.shiftKey) {
              this.prevYearNode.focus();
              flag = true;
            }
            break;

          case 'Esc':
          case 'Escape':
            this.close();
            flag = true;
            break;

          default:
            break;
        }
        break;

      case 'click':
        this.setTextboxDate();
        this.close();
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleCancelButton = function (event: KeyboardEvent) {
    let flag = false;

    switch (event.type) {
      case 'keydown':
        switch (event.key) {
          case 'Esc':
          case 'Escape':
            this.close();
            flag = true;
            break;

          default:
            break;
        }
        break;

      case 'click':
        this.close();
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  handleNextYearButton(event: KeyboardEvent) {
    let flag = false;

    switch (event.type) {
      case 'keydown':
        switch (event.key) {
          case 'Esc':
          case 'Escape':
            this.close();
            flag = true;
            break;

          case 'Enter':
            this.moveToNextYear();
            this.setFocusDay(false);
            flag = true;
            break;
        }

        break;

      case 'click':
        this.moveToNextYear();
        this.setFocusDay(false);
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handlePreviousYearButton(event: KeyboardEvent) {
    let flag = false;
    console.log(event);

    switch (event.type) {
      case 'keydown':
        switch (event.key) {
          case 'Enter':
            this.moveToPreviousYear();
            this.setFocusDay(false);
            flag = true;
            break;

          case 'Tab':
            if (event.shiftKey) {
              this.okButtonNode.focus();
              flag = true;
            }
            break;

          case 'Esc':
          case 'Escape':
            this.close();
            flag = true;
            break;

          default:
            break;
        }

        break;

      case 'click': {
        console.log('click');

        this.moveToPreviousYear();
        this.setFocusDay(false);
        break;
      }

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleNextMonthButton(event: KeyboardEvent) {
    let flag = false;

    switch (event.type) {
      case 'keydown':
        switch (event.key) {
          case 'Esc':
          case 'Escape':
            this.close();
            flag = true;
            break;

          case 'Enter':
            this.moveToNextMonth();
            this.setFocusDay(false);
            flag = true;
            break;
        }

        break;

      case 'click':
        this.moveToNextMonth();
        this.setFocusDay(false);
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handlePreviousMonthButton(event: KeyboardEvent) {
    let flag = false;

    switch (event.type) {
      case 'keydown':
        switch (event.key) {
          case 'Esc':
          case 'Escape':
            this.close();
            flag = true;
            break;

          case 'Enter':
            this.moveToPreviousMonth();
            this.setFocusDay(false);
            flag = true;
            break;
        }

        break;

      case 'click':
        this.moveToPreviousMonth();
        this.setFocusDay(false);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleDayKeyDown(event) {
    let flag = false;

    switch (event.key) {
      case 'Esc':
      case 'Escape':
        this.close();
        break;

      case ' ':
        this.setTextboxDate(event.currentTarget);
        flag = true;
        break;

      case 'Enter':
        this.setTextboxDate(event.currentTarget);
        this.close();
        flag = true;
        break;

      case 'Tab':
        this.cancelButtonNode.focus();
        if (event.shiftKey) {
          this.nextYearNode.focus();
        }
        this.setMessage('');
        flag = true;
        break;

      case 'Right':
      case 'ArrowRight':
        this.moveFocusToNextDay();
        flag = true;
        break;

      case 'Left':
      case 'ArrowLeft':
        this.moveFocusToPreviousDay();
        flag = true;
        break;

      case 'Down':
      case 'ArrowDown':
        this.moveFocusToNextWeek();
        flag = true;
        break;

      case 'Up':
      case 'ArrowUp':
        this.moveFocusToPreviousWeek();
        flag = true;
        break;

      case 'PageUp':
        if (event.shiftKey) {
          this.moveToPreviousYear();
        } else {
          this.moveToPreviousMonth();
        }
        this.setFocusDay();
        flag = true;
        break;

      case 'PageDown':
        if (event.shiftKey) {
          this.moveToNextYear();
        } else {
          this.moveToNextMonth();
        }
        this.setFocusDay();
        flag = true;
        break;

      case 'Home':
        this.moveFocusToFirstDayOfWeek();
        flag = true;
        break;

      case 'End':
        this.moveFocusToLastDayOfWeek();
        flag = true;
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleDayClick(event) {
    if (!this.isDayDisabled(event.currentTarget)) {
      this.setTextboxDate(event.currentTarget);
      this.close();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  handleDayFocus() {
    this.setMessage(this.messageCursorKeys);
  }

  handleButtonKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.open();
      this.setFocusDay();

      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleButtonClick(event) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
      this.setFocusDay();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  handleBackgroundMouseUp(event) {
    if (
      !this.buttonNode.contains(event.target) &&
      !this.dialogNode.contains(event.target)
    ) {
      if (this.isOpen()) {
        this.close(false);
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  // public emitClick<D = unknown>(detail: D) {
  //   this.onClick.emit(detail);
  // }
}
