"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const configuration_1 = require("../config/configuration");
const cache_service_1 = require("./cache.service");
let AppService = class AppService {
    constructor(httpService, cacheService) {
        this.httpService = httpService;
        this.cacheService = cacheService;
    }
    response(recipient, url, method, data, headers) {
        const config = configuration_1.configuration();
        const recipientUrl = config[recipient];
        const requestUrl = `${recipientUrl}/${url}`;
        delete headers.host;
        let axiosConfig = {
            headers,
            baseURL: requestUrl,
            method: method,
        };
        if (data && Object.keys(data).length && method === 'post') {
            axiosConfig = Object.assign(Object.assign({}, axiosConfig), { data });
        }
        else if (method === 'post') {
            axiosConfig = Object.assign(Object.assign({}, axiosConfig), { data: {} });
        }
        if (url === 'products/' && method === 'get') {
            if (this.cacheService.isData()) {
                return Promise.resolve({
                    status: 200,
                    headers: {
                        'access-control-allow-origin': '*',
                        'Content-Type': 'application/json; charset=utf-8',
                        'x-cache': 'proxy cache',
                    },
                    data: this.cacheService.get(),
                });
            }
        }
        return new Promise((resolve, reject) => {
            this.httpService.request(axiosConfig).subscribe((res) => {
                const { status, headers, data } = res;
                if (url === 'products/' && method === 'get') {
                    this.cacheService.set(data);
                }
                resolve({ status, headers, data });
            }, (err) => {
                if (err.response.status < common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
                    const { status, headers, data } = err.response;
                    resolve({ status, headers, data });
                }
                reject();
            });
        });
    }
    cannotProcessRequest() {
        throw new common_1.HttpException('Cannot process request', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
AppService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService,
        cache_service_1.CacheService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map