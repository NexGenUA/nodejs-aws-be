export interface CacheModel {
  headers: { [key: string]: string };
  data: any[];
  expDate?: number;
}
