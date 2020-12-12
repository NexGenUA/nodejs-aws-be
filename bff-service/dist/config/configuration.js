"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const configuration = () => ({
    api: process.env.CART_URL,
    products: process.env.PRODUCTS_URL,
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map