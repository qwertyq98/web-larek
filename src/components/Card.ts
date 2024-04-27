import { ICard, ICardActions, categoryType } from "../types";
import { createClassCategory, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Card extends Component<ICard>{
    protected _image: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected blockName: string, actions?: ICardActions) {
        super(container);

        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`);


        if (actions?.onClick) {
            if (this._button) {
              this._button.addEventListener('click', actions.onClick);
            } else {
              container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set category(value: categoryType) {
        this.setText(this._category, value);
        this._category.classList.add(createClassCategory(value));
    }

    set price(value: string) {
        this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }
}