import { ICustomer } from "./customer";
import { IService } from "./service";
import { IShop } from "./shop";

export interface ICreateQuoteBody {
  customer_id: string;
  shop_id: string;
  service_id: string;
}

export interface IQuoteList {
  [id: string]: IQuote;
}

export interface IQuotesState {
  activeChat: string | null;
  quotes: IQuoteList;
}

export interface IMessage {
  id: string;
  quoteId: string;
  customerId: string | null;
  shopId: string | null;
  message: string;
  createdAt: Date;
}

export interface IQuote {
  id: string;
  customer: ICustomer;
  shop: IShop;
  service: IService;
  createTime: Date;
  updateTime: Date;
  messageList: IMessage[] | [];
}
