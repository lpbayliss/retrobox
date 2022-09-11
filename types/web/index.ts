import { Box, Drop, Item, User } from "../core";
import { Nullable } from "../utils";

export interface ProblemJson {
  title: string;
  status: number;
  detail: string;
  instance: string;
}

export interface ResponseBody<Data, Meta = void> {
  data: Data;
  meta: Nullable<Meta>;
}

export interface CreateBoxResponse extends ResponseBody<Box, null> {}
export interface FetchBoxResponse extends ResponseBody<Box, null> {}
export interface AddItemResponse extends ResponseBody<Item, null> {}
export interface CreateDropResponse extends ResponseBody<Drop, null> {}
export interface FetchDropResponse extends ResponseBody<Drop, null> {}
export interface DeleteItemResponse extends ResponseBody<Item, null> {}
export interface FetchUserResponse extends ResponseBody<User, null> {}
