import { z } from 'zod';
export declare const loginRequestSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const registerRequestSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    password: string;
    displayName?: string | undefined;
    timezone?: string | undefined;
}, {
    email: string;
    username: string;
    password: string;
    displayName?: string | undefined;
    timezone?: string | undefined;
}>;
export declare const accountDeletionRequestSchema: z.ZodObject<{
    password: z.ZodString;
    confirmation: z.ZodLiteral<"DELETE">;
}, "strip", z.ZodTypeAny, {
    password: string;
    confirmation: "DELETE";
}, {
    password: string;
    confirmation: "DELETE";
}>;
export declare const passwordResetRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const passwordResetConfirmSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    newPassword: string;
}, {
    token: string;
    newPassword: string;
}>;
export declare const updateUserRequestSchema: z.ZodObject<{
    displayName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    displayName?: string | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    website?: string | undefined;
    timezone?: string | undefined;
}, {
    displayName?: string | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    website?: string | undefined;
    timezone?: string | undefined;
}>;
export declare const updatePreferencesSchema: z.ZodObject<{
    theme: z.ZodOptional<z.ZodEnum<["dark", "light", "auto"]>>;
    language: z.ZodOptional<z.ZodString>;
    notifications: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodBoolean>;
        push: z.ZodOptional<z.ZodBoolean>;
        achievements: z.ZodOptional<z.ZodBoolean>;
        recommendations: z.ZodOptional<z.ZodBoolean>;
        friendActivity: z.ZodOptional<z.ZodBoolean>;
        platformUpdates: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        recommendations?: boolean | undefined;
        push?: boolean | undefined;
        achievements?: boolean | undefined;
        email?: boolean | undefined;
        friendActivity?: boolean | undefined;
        platformUpdates?: boolean | undefined;
    }, {
        recommendations?: boolean | undefined;
        push?: boolean | undefined;
        achievements?: boolean | undefined;
        email?: boolean | undefined;
        friendActivity?: boolean | undefined;
        platformUpdates?: boolean | undefined;
    }>>;
    display: z.ZodOptional<z.ZodObject<{
        compactMode: z.ZodOptional<z.ZodBoolean>;
        showGameCovers: z.ZodOptional<z.ZodBoolean>;
        animateTransitions: z.ZodOptional<z.ZodBoolean>;
        showRatings: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        compactMode?: boolean | undefined;
        showGameCovers?: boolean | undefined;
        animateTransitions?: boolean | undefined;
        showRatings?: boolean | undefined;
    }, {
        compactMode?: boolean | undefined;
        showGameCovers?: boolean | undefined;
        animateTransitions?: boolean | undefined;
        showRatings?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    theme?: "auto" | "dark" | "light" | undefined;
    language?: string | undefined;
    notifications?: {
        recommendations?: boolean | undefined;
        push?: boolean | undefined;
        achievements?: boolean | undefined;
        email?: boolean | undefined;
        friendActivity?: boolean | undefined;
        platformUpdates?: boolean | undefined;
    } | undefined;
    display?: {
        compactMode?: boolean | undefined;
        showGameCovers?: boolean | undefined;
        animateTransitions?: boolean | undefined;
        showRatings?: boolean | undefined;
    } | undefined;
}, {
    theme?: "auto" | "dark" | "light" | undefined;
    language?: string | undefined;
    notifications?: {
        recommendations?: boolean | undefined;
        push?: boolean | undefined;
        achievements?: boolean | undefined;
        email?: boolean | undefined;
        friendActivity?: boolean | undefined;
        platformUpdates?: boolean | undefined;
    } | undefined;
    display?: {
        compactMode?: boolean | undefined;
        showGameCovers?: boolean | undefined;
        animateTransitions?: boolean | undefined;
        showRatings?: boolean | undefined;
    } | undefined;
}>;
export declare const updatePrivacySchema: z.ZodObject<{
    profileVisibility: z.ZodOptional<z.ZodEnum<["public", "friends", "private"]>>;
    sharePlaytime: z.ZodOptional<z.ZodBoolean>;
    shareAchievements: z.ZodOptional<z.ZodBoolean>;
    shareGameLibrary: z.ZodOptional<z.ZodBoolean>;
    allowFriendRequests: z.ZodOptional<z.ZodBoolean>;
    showOnlineStatus: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    profileVisibility?: "private" | "public" | "friends" | undefined;
    sharePlaytime?: boolean | undefined;
    shareAchievements?: boolean | undefined;
    shareGameLibrary?: boolean | undefined;
    allowFriendRequests?: boolean | undefined;
    showOnlineStatus?: boolean | undefined;
}, {
    profileVisibility?: "private" | "public" | "friends" | undefined;
    sharePlaytime?: boolean | undefined;
    shareAchievements?: boolean | undefined;
    shareGameLibrary?: boolean | undefined;
    allowFriendRequests?: boolean | undefined;
    showOnlineStatus?: boolean | undefined;
}>;
export declare const connectIntegrationSchema: z.ZodObject<{
    platform: z.ZodEnum<["steam", "discord", "youtube", "twitch", "spotify"]>;
    accessToken: z.ZodOptional<z.ZodString>;
    refreshToken: z.ZodOptional<z.ZodString>;
    scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    platform: "steam" | "discord" | "youtube" | "twitch" | "spotify";
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    scopes?: string[] | undefined;
}, {
    platform: "steam" | "discord" | "youtube" | "twitch" | "spotify";
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    scopes?: string[] | undefined;
}>;
export declare const updateIntegrationSchema: z.ZodObject<{
    isActive: z.ZodOptional<z.ZodBoolean>;
    syncConfig: z.ZodOptional<z.ZodObject<{
        autoSync: z.ZodOptional<z.ZodBoolean>;
        syncFrequency: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        autoSync?: boolean | undefined;
        syncFrequency?: number | undefined;
    }, {
        autoSync?: boolean | undefined;
        syncFrequency?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    isActive?: boolean | undefined;
    syncConfig?: {
        autoSync?: boolean | undefined;
        syncFrequency?: number | undefined;
    } | undefined;
}, {
    isActive?: boolean | undefined;
    syncConfig?: {
        autoSync?: boolean | undefined;
        syncFrequency?: number | undefined;
    } | undefined;
}>;
export interface ValidationError {
    field: string;
    message: string;
    code: string;
}
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    data?: any;
}
export declare function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult;
export declare function validateLoginRequest(data: unknown): ValidationResult;
export declare function validateRegisterRequest(data: unknown): ValidationResult;
export declare function validateAccountDeletionRequest(data: unknown): ValidationResult;
export declare function validatePasswordResetRequest(data: unknown): ValidationResult;
export declare function validatePasswordResetConfirm(data: unknown): ValidationResult;
export declare function validateUpdateUserRequest(data: unknown): ValidationResult;
export declare function validateUpdatePreferencesRequest(data: unknown): ValidationResult;
export declare function validateUpdatePrivacyRequest(data: unknown): ValidationResult;
export declare function validateConnectIntegrationRequest(data: unknown): ValidationResult;
export declare function validateUpdateIntegrationRequest(data: unknown): ValidationResult;
export declare function validateUserObject(user: any): ValidationResult;
export declare function validateUserIntegrationObject(integration: any): ValidationResult;
export declare function sanitizeString(input: unknown, maxLength?: number): string;
export declare function sanitizeEmail(input: unknown): string;
export declare function sanitizeUsername(input: unknown): string;
export declare function validateRateLimit(identifier: string, maxRequests: number, windowMs: number): {
    allowed: boolean;
    remaining: number;
    resetTime: Date;
};
//# sourceMappingURL=validation.d.ts.map