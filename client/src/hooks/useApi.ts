import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

interface ApiState<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
}

/** GET an endpoint; returns { data, error, loading, reload }. Pass null to skip the request. */
export default function useApi<T>(endpoint: string | null) {
    const [state, setState] = useState<ApiState<T>>({ data: null, error: null, loading: Boolean(endpoint) });
    const [version, setVersion] = useState(0);

    useEffect(() => {
        if (!endpoint) return;
        let cancelled = false;
        setState((s) => ({ ...s, loading: true }));
        api.get<T>(endpoint)
            .then((data) => !cancelled && setState({ data, error: null, loading: false }))
            .catch((error: Error) => !cancelled && setState({ data: null, error, loading: false }));
        return () => {
            cancelled = true;
        };
    }, [endpoint, version]);

    const reload = useCallback(() => setVersion((v) => v + 1), []);
    return { ...state, reload };
}
