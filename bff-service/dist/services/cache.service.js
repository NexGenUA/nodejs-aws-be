"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
let CacheService = class CacheService {
    constructor() {
        this.cache = {
            data: [],
            expDate: 0,
        };
        this.expTime = 120000;
    }
    set(cache) {
        this.cache.data = cache;
        this.cache.expDate = Date.now() + this.expTime;
    }
    get() {
        return this.cache.data;
    }
    isData() {
        return !!this.cache.data.length && this.cache.expDate > Date.now();
    }
};
CacheService = __decorate([
    common_1.Injectable()
], CacheService);
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map