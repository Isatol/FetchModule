import { Interface } from "readline";
import * as utils from "./utils";

const headersInit = {
  "Content-Type": "application/json"
};

export function IsNullOrUndefined(objeto): boolean {
  return objeto === null || objeto === undefined;
}

export function query(params: object) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
}

export interface IResponse {
  data: any,
  default: ResponseInit,
  status: Number
}