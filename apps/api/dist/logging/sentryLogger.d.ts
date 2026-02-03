import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
export interface SentryConfig {
    dsn: string;
    environment: string;
    release?: string;
    tracesSampleRate?: number;
}
export declare class SentryLogger {
    private static instance;
    private isInitialized;
    private constructor();
    static getInstance(): SentryLogger;
    initialize(config: SentryConfig): void;
    captureException(error: Error, context?: {
        request?: Request;
        userId?: string;
        tags?: Record<string, string>;
        extra?: Record<string, any>;
    }): void;
    captureMessage(message: string, level?: Sentry.SeverityLevel, context?: {
        request?: Request;
        userId?: string;
        tags?: Record<string, string>;
        extra?: Record<string, any>;
    }): void;
    setUser(user: {
        id?: string;
        email?: string;
        username?: string;
    }): void;
    clearUser(): void;
    setTags(tags: Record<string, string>): void;
    setExtra(key: string, value: any): void;
    addBreadcrumb(breadcrumb: {
        message?: string;
        category?: string;
        level?: Sentry.SeverityLevel;
        data?: Record<string, any>;
    }): void;
    captureSecurityEvent(event: string, severity?: Sentry.SeverityLevel, context?: {
        request?: Request;
        userId?: string;
        details?: Record<string, any>;
    }): void;
    startTransaction(name: string, operation?: string): Sentry.Transaction | undefined;
    isReady(): boolean;
}
export declare const sentryLogger: SentryLogger;
export declare function initializeSentry(): void;
export declare function sentryErrorHandler(error: Error, req: Request, res: Response, next: any): void;
export declare function sentryRequestHandler(req: Request, res: Response, next: any): void;
//# sourceMappingURL=sentryLogger.d.ts.map