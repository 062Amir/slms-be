import { SortOrder } from "mongoose";

export interface IQuery {
  page: number;
  limit: number;
  sort: string;
  sortBy: SortOrder;
}

export interface IBuildQuery {
  query: any;
  queryParams: IQuery;
}
