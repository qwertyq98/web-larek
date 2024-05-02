import { AppModelData } from './components/AppModelData';
import { Basket } from './components/Basket';
import { BasketItem } from './components/BasketItem';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/base/Modal';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IServerResponse, ICard } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

// Шаблоны

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalTemplate = ensureElement<HTMLElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const api = new Api(API_URL);
const events = new EventEmitter();
const appData = new AppModelData({}, events);

const page = new Page(document.body, events);
const modal = new Modal(modalTemplate, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Получаем лоты с сервера
api
  .get('/product')
  .then((res: IServerResponse) => {
    appData.setCatalog(res.items as ICard[]);
  })
  .catch((err) => {
    console.error(err);
  });

// Изменились элементы каталога
events.on('items:changed', () => {
  page.catalog = appData.catalog.map((item) => {
    const card = new Card(cloneTemplate(cardTemplate), 'card', {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

// Открыть лот
events.on('card:select', (item: ICard) => {
  appData.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), 'card', {
    onClick: () => {
      events.emit('card:toBasket', item)
    },
  });
  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
      description: item.description
    })
  });
})

// Добавление товара в корзину
events.on('card:toBasket', (item: ICard) => {
  appData.addToBasket(item);

  basket.items = appData.basket.map((item, index) => {
    const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('basket:delete', item)
    });

    return basketItem.render({
      title: item.title,
      price: item.price | 0,
      number: index + 1
    });
  })

  page.counter = appData.getBasketAmount();
  basket.total = appData.getTotalBasketPrice();
  basket.selected = appData.getBasketAmount();
  modal.close();
})

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

// Открыть корзину
events.on('bids:open', () => {
  modal.render({
    content: createElement<HTMLElement>('div', {}, basket.render())
  });
});

// Удалить товар из корзины
events.on('basket:delete', (item: ICard) => {
  appData.deleteFromBasket(item.id);
  basket.total = appData.getTotalBasketPrice();
  page.counter = appData.getBasketAmount();
  basket.selected = appData.getBasketAmount();
  basket.renumerateItems();

  if (!appData.basket.length) {
    basket.items = [];
  }
})