export type ApiErrorBody = {
    code: string; // EMAIL_TAKEN, PHONE_TAKEN, TOKEN_INVALID, RESEND_TOO_SOON, ...
    message: string;
    fieldErrors?: Record<string, string>;
};

export class ApiError extends Error {
    code: string;
    fieldErrors?: Record<string, string>;
    status: number;

    constructor(status: number, body: ApiErrorBody) {
        super(body.message);
        this.status = status;
        this.code = body.code;
        this.fieldErrors = body.fieldErrors;
    }
}