import { Nullable } from "../utils";

export interface Item {
  message: string;
  author?: string;
}

export interface Drop {
  id: string;
  itemCount: number;
  createdAt: Date;
  items: Item[];
}

export interface Box {
  id: string;
  name: string;
  itemCount: number;
  latestDrop: Nullable<Omit<Drop, "items">>;
  allDrops: Omit<Drop, "items">[];
}

export interface User {
  id: string;
  email: string;
  nickname?: string;
}
