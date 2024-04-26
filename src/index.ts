import { AppModelData } from './components/AppModelData';
import { CardItem } from './components/Card';
import { Page } from './components/Page';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IServerResponse, ICard } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Шаблоны

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const api = new Api(API_URL);
const events = new EventEmitter();
const appData = new AppModelData({}, events);

const page = new Page(document.body, events);

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
    const card = new CardItem(cloneTemplate(cardTemplate));
    return card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});