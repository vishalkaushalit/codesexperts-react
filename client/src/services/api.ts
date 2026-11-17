export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
    status: number;
    errors: FieldErrors;

    constructor(message: string, status: number, errors: FieldErrors = {}) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

type Body = Record<string, unknown> | FormData;

/**
 * Call the Express API. `body` may be a plain object (sent as JSON) or FormData (for image uploads).
 * The admin session lives in an httpOnly cookie that the browser sends automatically.
 */
export async function request<T>(method: string, endpoint: string, body?: Body): Promise<T> {
    const isForm = body instanceof FormData;
    const res = await fetch(`/api${endpoint}`, {
        method,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });

    const data = (await res.json().catch(() => ({}))) as { message?: string; errors?: FieldErrors };
    if (!res.ok) {
        if (res.status === 401 && endpoint !== '/auth/me' && endpoint !== '/auth/login') {
            window.dispatchEvent(new Event('auth:expired'));
        }
        throw new ApiError(data.message || 'Something went wrong. Please try again.', res.status, data.errors ?? {});
    }
    return data as T;
}

export const api = {
    get: <T>(endpoint: string) => request<T>('GET', endpoint),
    post: <T>(endpoint: string, body?: Body) => request<T>('POST', endpoint, body),
    put: <T>(endpoint: string, body?: Body) => request<T>('PUT', endpoint, body),
    delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),
};

/** First error message per field, for showing under inputs. */
export const firstErrors = (err: unknown): Record<string, string> =>
    err instanceof ApiError ? Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])) : {};
