import { IAppState, ICard } from "../types";
import { CardModel } from "./CardModel";
import { Model } from "./base/Model";

export class AppModelData extends Model<IAppState> {
    catalog: CardModel[];

    setCatalog(items: ICard[]) {
        this.catalog = items.map(item => new CardModel(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
}