import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../services/api';
import type { User } from '../types/models';

interface Credentials {
    email: string;
    password: string;
    remember: boolean;
}

interface AuthValue {
    /** undefined while checking the session, null when logged out. */
    user: User | null | undefined;
    checking: boolean;
    setUser: (user: User | null) => void;
    login: (credentials: Credentials) => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    const refresh = useCallback(() => {
        api.get<{ user: User }>('/auth/me')
            .then((res) => setUser(res.user))
            .catch(() => setUser(null));
    }, []);

    useEffect(() => {
        refresh();
        const expired = () => setUser(null);
        window.addEventListener('auth:expired', expired);
        return () => window.removeEventListener('auth:expired', expired);
    }, [refresh]);

    const value = useMemo<AuthValue>(
        () => ({
            user,
            checking: user === undefined,
            setUser,
            async login(credentials) {
                const res = await api.post<{ user: User }>('/auth/login', { ...credentials });
                setUser(res.user);
                return res.user;
            },
            async logout() {
                await api.post('/auth/logout').catch(() => undefined);
                setUser(null);
            },
        }),
        [user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
