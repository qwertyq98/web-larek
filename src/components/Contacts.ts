import { IContacts } from "../types";
import { Form } from "./base/Form";
import { IEvents } from "./base/events";

export class Contacts extends Form<IContacts> {
  private _button: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._button = container.querySelector(`.button`);
    this._button.addEventListener('click', () => {
      events.emit('order:send');
      (container.elements.namedItem('email') as HTMLButtonElement).value = '';
      (container.elements.namedItem('phone') as HTMLButtonElement).value = '';
    });
  }
}