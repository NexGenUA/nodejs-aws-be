import { Headers, HttpClassResponse, HttpResponse, ResponseType } from '../models/response.model';

class Response implements HttpClassResponse {
  _headers: Headers;
  _statusCode: number;
  _response: HttpResponse;

  constructor() {
    this._headers = {
      'Access-Control-Allow-Origin': '*',
    };

    this._statusCode = 200;

    this._response = {
      headers: this._headers,
      statusCode: this._statusCode,
    };
  }

  send(message: string): HttpResponse {
    this._response.body = message;
    this.headers({
      'Content-Type': 'text/html'
    });
    return this._response;
  }

  json(responseObject: ResponseType): HttpResponse {
    this._response.body = JSON.stringify(responseObject);
    this.headers({
      'Content-Type': 'application/json'
    });
    return this._response;
  }

  headers(headers: Headers): HttpClassResponse {
    this._headers = (
      this._response.headers = {
      ...this._headers,
      ...headers
    });
    return this;
  }

  status(status: number): HttpClassResponse {
    this._response.statusCode = status;
    return this;
  }

  sendInternal(): HttpResponse {
    this._response.body = 'Internal Server Error';
    this.headers({
      'Content-Type': 'text/html'
    });
    this.status(500);
    return this._response;
  }
}

export const res = (): HttpClassResponse => new Response();
