export declare class HttpClassResponse {
  send(message: string): HttpResponse;
  json(responseObject: ResponseType): HttpResponse;
  headers(headers: Headers): HttpClassResponse;
  status(status: number): HttpClassResponse;
  sendInternal(): HttpResponse;
}

export interface Headers {
  [key: string]: string;
}

export interface ResponseObject {
  [key: string]: string;
}

export type ResponseType = ResponseObject | ResponseObject[];

export interface HttpResponse {
  headers: Headers
  statusCode: number;
  body?: string;
}
