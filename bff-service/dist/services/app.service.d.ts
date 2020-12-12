import { HttpService } from '@nestjs/common';
import { CacheService } from './cache.service';
export declare class AppService {
    private httpService;
    private cacheService;
    constructor(httpService: HttpService, cacheService: CacheService);
    response(recipient: string, url: string, method: string, data: any, headers: any): Promise<any>;
    cannotProcessRequest(): never;
}
