import { FormErrors, IAppState, ICard, IOrder, IOrderForm } from "../types";
import { CardModel } from "./CardModel";
import { Model } from "./base/Model";

export class AppModelData extends Model<IAppState> {
    catalog: CardModel[];
    preview: string;
    basket: ICard[] = [];
    order: IOrder = {
        address: '',
        payment: '',
        email: '',
        phone: '',
        total: 0,
        items: [] 
    };
    formErrors: FormErrors = {};

    setCatalog(items: ICard[]) {
        this.catalog = items.map(item => new CardModel(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addToBasket(value: ICard) {
        this.basket.push(value);
    }

    getBasketAmount() {
        return this.basket.length;
    }

    getTotalBasketPrice() {
        const sum = this.basket.reduce((sum, next) => sum + next.price, 0);
        return sum + ' синапсов';
    }

    deleteFromBasket(id: string) {
        this.basket = this.basket.filter(item => item.id !== id)
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
          errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
          errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
    
    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
    
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
        if (this.validateContacts()) {
            this.events.emit('contacts:ready', this.order);
        }
      }
}