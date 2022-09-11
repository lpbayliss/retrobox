import {
  AddItemResponse,
  CreateBoxResponse,
  CreateDropResponse,
  FetchBoxResponse,
  FetchDropResponse,
  FetchUserResponse,
} from "../types";
import to from "await-to-js";
import axios from "axios";
import { IncomingHttpHeaders } from "http";

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 1000,
  withCredentials: true,
});

export const fetchBox = async (
  id: string,
  headers?: IncomingHttpHeaders
): Promise<FetchBoxResponse> => {
  const [err, res] = await to(
    client.get<FetchBoxResponse>(`/boxes/${id}`, {
      ...(headers && { headers: { cookie: String(headers.cookie) } }),
    })
  );
  if (err) throw err;
  return res.data;
};

export const getDrop = async (
  id: string,
  headers?: IncomingHttpHeaders
): Promise<FetchDropResponse> => {
  const [err, res] = await to(
    client.get<FetchDropResponse>(`/drops/${id}`, {
      ...(headers && { headers: { cookie: String(headers.cookie) } }),
    })
  );
  if (err) throw err;
  return res.data;
};

export const addItem = async (
  { id, message, author }: { id: string; message: string; author?: string },
  headers?: IncomingHttpHeaders
): Promise<AddItemResponse> => {
  const [err, res] = await to(
    client.post<AddItemResponse>(
      `/boxes/${id}/add-item`,
      { message, author },
      {
        ...(headers && { headers: { cookie: String(headers.cookie) } }),
      }
    )
  );
  if (err) throw err;
  return res.data;
};

export const createBox = async (
  name: string
  // headers?: IncomingHttpHeaders
): Promise<CreateBoxResponse> => {
  const [err, res] = await to(
    client.post<CreateBoxResponse>(
      `/boxes`,
      { name }
      // {
      //   ...(headers && { headers: { cookie: String(headers.cookie) } }),
      // }
    )
  );
  if (err) throw err;
  return res.data;
};

export const createDrop = async (
  id: string,
  headers?: IncomingHttpHeaders
): Promise<CreateDropResponse> => {
  const [err, res] = await to(
    client.post<CreateDropResponse>(
      `/boxes/${id}/create-drop`,
      {},
      {
        ...(headers && { headers: { cookie: String(headers.cookie) } }),
      }
    )
  );
  if (err) throw err;
  return res.data;
};

export const fetchMe = async (
  headers?: IncomingHttpHeaders
): Promise<FetchUserResponse> => {
  const [err, res] = await to(
    client.get<FetchUserResponse>(`/me`, {
      ...(headers && { headers: { cookie: String(headers.cookie) } }),
    })
  );
  if (err) throw err;
  return res.data;
};

export const requestMagicLink = async (destination: string) => {
  const [err, res] = await to(client.post(`/auth/login`, { destination }));
  if (err) return null;
  return res.data;
};

export const sendToken = async (token: string): Promise<any> => {
  const [err, res] = await to(
    client.get(`/auth/login/callback`, { params: { token } })
  );
  if (err) throw err;
  const setCookie = res?.headers["set-cookie"] || [];
  return { setCookie };
};
