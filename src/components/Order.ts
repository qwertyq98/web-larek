import { IOrder } from "../types";
import { Form } from "./base/Form";
import { IEvents } from "./base/events";

export class Order extends Form<IOrder> {
    private _cash?: HTMLButtonElement;
    private _card?: HTMLButtonElement;
    private _address?: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._card = container.elements.namedItem('card') as HTMLButtonElement;
        this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
    
    
        if (this._cash) {
          this._cash.addEventListener('click', () => {
            this._cash.classList.add('button_alt-active')
            this._card.classList.remove('button_alt-active')
            this.onInputChange('payment', 'cash')
          })
        }
        if (this._card) {
          this._card.addEventListener('click', () => {
            this._card.classList.add('button_alt-active')
            this._cash.classList.remove('button_alt-active')
            this.onInputChange('payment', 'card')
          })
        }
    }
}