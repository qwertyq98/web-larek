import { AppModelData } from './components/AppModelData';
import { Card } from './components/Card';
import { CardModel } from './components/CardModel';
import { Page } from './components/Page';
import { Modal } from './components/base/Modal';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IServerResponse, ICard } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Шаблоны

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalTemplate = ensureElement<HTMLElement>('#modal-container')

const api = new Api(API_URL);
const events = new EventEmitter();
const appData = new AppModelData({}, events);

const page = new Page(document.body, events);
const modal = new Modal(modalTemplate, events);

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
  const card = new Card(cloneTemplate(cardPreviewTemplate), 'card');
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

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});