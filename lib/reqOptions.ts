export interface IOptions {
  /** Parámetros para realizar una consulta GET */
  params: {};
  /** Manda los datos en el body de la petición*/
  data: BodyInit;
  /** Headers que se incluirán en la petición, por default se agrega el Content-Type: application/json */
  headers: HeadersInit;
  /** Método HTTP para realizar la petición */
  method: "get" | "post" | "put" | "delete" | "patch";
  /** La manera en que se devolverá el resultado de la petición, por default es json */
  result: "json" | "arrayBuffer" | "blob" | "text";
  retry: IRetry
}


interface IRetry {
  retryOn: Array<Number>;
  redirectToPageIfFails: string;
}