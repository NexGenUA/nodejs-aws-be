"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet = require("helmet");
const port = process.env.PORT || 3000;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(helmet());
    app.enableCors();
    await app.listen(port, () => {
        console.log(`Bff service is running: http://localhost:${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map