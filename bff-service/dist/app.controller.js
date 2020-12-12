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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./services/app.service");
const paths = new Set(['api', 'products']);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    main() {
        return 'Nexgenua proxy service works';
    }
    async anyRequest(path, body, req, res) {
        if (paths.has(path)) {
            try {
                const response = await this.appService.response(path, `${path}${req.url}`, req.method.toLowerCase(), body, req.headers);
                return res
                    .set(Object.assign({}, response.headers))
                    .status(response.status)
                    .json(response.data);
            }
            catch (_a) {
                throw new common_1.InternalServerErrorException();
            }
        }
        if (req.originalUrl === '/favicon.ico') {
            throw new common_1.ForbiddenException({
                message: 'Forbidden',
            });
        }
        this.appService.cannotProcessRequest();
    }
    all() {
        this.appService.cannotProcessRequest();
    }
};
__decorate([
    common_1.Get('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "main", null);
__decorate([
    common_1.All(':path'),
    __param(0, common_1.Param('path')),
    __param(1, common_1.Body()),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "anyRequest", null);
__decorate([
    common_1.All(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "all", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map