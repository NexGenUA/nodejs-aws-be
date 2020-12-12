import { Request, Response } from 'express';
import { AppService } from './services/app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    main(): string;
    anyRequest(path: string, body: any, req: Request, res: Response): Promise<any>;
    all(): never;
}
