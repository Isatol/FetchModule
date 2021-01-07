import * as utils from "./utils";
import {IResponse} from "./utils"
import { IOptions } from "./reqOptions";
//const fetch = require("node-fetch");

var urlBase: RequestInfo = "";
var headers: HeadersInit;
/**
 * create a new instance to autocomplete the initial URL
 * @param baseURL Corresponds to the initial URL
 */
export function createInstance(baseURL: RequestInfo): void {
  urlBase = baseURL;
}

/**
 * create a new instance to autocomplete the initial URL
 * @param baseURL Corresponds to the initial URL
 */
export function useWithHeaders(headersInit: HeadersInit) {
  headers = headersInit;
}

/**
 * Make a fetch request to a specific URI
 * @param url Address where the resources will be requested
 * @param options Options to complement the request
 */
export async function request(url: RequestInfo, options: IOptions): Promise<IResponse> {
  let headersInit: HeadersInit = options.headers || headers;
  if (!url.toString().startsWith("http")) {
    url = `${urlBase.toString()}${url.toString()}`;
  }
  if(options.params){
    url += `?${utils.query(options.params)}`;
  }
  const resp = await fetch(url, {
    method: options?.method ?? "get",
    headers: headersInit,
    body: options.data
  });
  let result;
  if(resp.ok){
    switch(options.result){
      case "arrayBuffer":
        result = await resp.arrayBuffer();
        break;
      case "blob": 
        result = await resp.blob();
        break;
      case "json":
        result = await resp.json();
        break;
      case "text":
        result = await resp.text();
        break;
      default:
        result = await resp.json();
    }
  }
  else if(options.retry){
    const numberOfRetries = 1
    if(Array.isArray(options.retry.retryOn) && options.retry.retryOn.includes(resp.status)){
      for (let i = 0; i < numberOfRetries; i++) {
        if(!options.retry.retryOn.includes(resp.status)) break;
        if(i +1 === numberOfRetries){
          if(options.retry.redirectToPageIfFails){
            location.replace(options.retry.redirectToPageIfFails);
          }
          break;
        }
        return await request(url, options);
      }
    }
  }
  else {
    const text = await resp.text();
    let jsonText = text
                      .substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
                      .replace(/'/g, '"');
    let error;
    try {
      error = JSON.parse(jsonText);
    } catch (e) {
      error = JSON.parse(`{'exception': '${text}' }`)
    }
    throw {
      error: error,
      status: resp.status
    };
  }
  return {
    data: result,
    default: resp,
    status: resp.status
  }
}
