import { Injectable } from '@nestjs/common';

import { CacheModel } from '../models/cache.model';

@Injectable()
export class CacheService {
  private readonly cache: CacheModel = {
    headers: {},
    data: [],
    expDate: 0,
  };

  private readonly expTime: number = 120000;

  set(cache: CacheModel) {
    this.cache.data = cache.data;
    this.cache.headers = cache.headers;
    this.cache.expDate = Date.now() + this.expTime;
  }

  get(): CacheModel {
    return {
      data: this.cache.data,
      headers: this.cache.headers,
    };
  }

  isData(): boolean {
    return !!this.cache.data.length && this.cache.expDate > Date.now();
  }
}
