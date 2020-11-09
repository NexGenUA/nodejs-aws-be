class Response {
  constructor() {
    this._headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    this._statusCode = 200;

    this._response = {
      headers: this._headers,
      statusCode: this._statusCode,
    };
  }

  send(string) {
    this._response.body = string;
    this.headers({
      'Content-Type': 'text/html'
    });
    return this._response;
  }

  json(object) {
    this._response.body = JSON.stringify(object);
    this.headers({
      'Content-Type': 'application/json'
    });
    return this._response;
  }

  headers(headers) {
    this._headers = (
      this._response.headers = {
      ...this._headers,
      ...headers
    });
    return this;
  }

  status(status) {
    this._response.statusCode = status;
    return this;
  }

  sendInternal() {
    this._response.body = 'Internal Server Error';
    this.headers({
      'Content-Type': 'text/html'
    });
    this.status(500);
    return this._response;
  }
}

export const res = () => new Response();
