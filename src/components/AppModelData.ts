import { IAppState, ICard } from "../types";
import { CardModel } from "./CardModel";
import { Model } from "./base/Model";

export class AppModelData extends Model<IAppState> {
    catalog: CardModel[];
    preview: string;
    basket: ICard[] = [];

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
}