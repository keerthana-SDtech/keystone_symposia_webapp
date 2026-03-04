const SESSION_KEY = 'accessToken';
let _accessToken: string | null = null;

function isExpired(token: string): boolean {
    try {
        const { exp } = JSON.parse(atob(token.split('.')[1])) as { exp: number };
        return Date.now() >= exp * 1000 - 30_000; // 30 s early buffer
    } catch {
        return true;
    }
}

export const tokenStore = {
    get: (): string | null => _accessToken ?? sessionStorage.getItem(SESSION_KEY),
    set: (t: string | null) => {
        _accessToken = t;
        if (t) sessionStorage.setItem(SESSION_KEY, t);
        else sessionStorage.removeItem(SESSION_KEY);
    },
    clear: () => {
        _accessToken = null;
        sessionStorage.removeItem(SESSION_KEY);
    },
    isExpired,
};
