export type categoryType = "софт-скил" | "другое" | "дополнительное" | "кнопка" | "хард-скил";

export interface ICard {
    id: string,
    description?: string,
    image: string,
    title: string,
    category: categoryType,
    price: number | null
}

export interface IOrder {
    payment: string, 
    email:string,
    phone: string, 
    address: string,
    total: number,
    items: string[]
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IAppState {
    catalog: ICard[];
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IServerResponse {
    items: ICard[];
}
