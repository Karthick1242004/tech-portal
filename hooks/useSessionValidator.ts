'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/store/session.store';
import { validateSession } from '@/lib/api';

/**
 * Custom hook to poll session validity
 * Checks every 10 seconds if the session is still active
 * If session is invalidated (another technician logged in), triggers SessionEndedCard
 */
export function useSessionValidator() {
    const { isAuthenticated, isTestMode, setInvalidated, clearSession } = useSessionStore();

    useEffect(() => {
        // Don't poll if not authenticated or in test mode
        if (!isAuthenticated || isTestMode) {
            return;
        }

        // Initial validation
        let mounted = true;

        const checkSession = async () => {
            if (!mounted) return;

            try {
                await validateSession();
            } catch (error: any) {
                if (!mounted) return;

                // Check if session was invalidated (distinct from expiration/auth errors)
                if (error.code === 'SESSION_INVALIDATED') {
                    setInvalidated(true);
                    clearSession();
                }
                // For other auth errors (expired, etc), let the global handler redirect
            }
        };

        // Poll every 10 seconds
        const interval = setInterval(checkSession, 10000);

        // Immediate check on mount
        checkSession();

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [isAuthenticated, isTestMode, setInvalidated, clearSession]);
}
