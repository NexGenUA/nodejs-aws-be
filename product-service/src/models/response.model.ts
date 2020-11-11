import { APIGatewayProxyResult } from 'aws-lambda';

export declare class HttpClassResponse {
  send(message: string): APIGatewayProxyResult;
  json(responseObject: ResponseType): APIGatewayProxyResult;
  headers(headers: Headers): HttpClassResponse;
  status(status: number): HttpClassResponse;
  sendInternal(): APIGatewayProxyResult;
}

export interface Headers {
  [key: string]: string;
}

export interface ResponseObject {
  [key: string]: string;
}

export type ResponseType = ResponseObject | ResponseObject[];
