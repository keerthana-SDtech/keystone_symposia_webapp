import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../providers/useAuthContext';
import { ROLE_HOME } from './roleHome';

export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user, isLoading } = useAuthContext();

    if (isLoading) return null;

    if (isAuthenticated && user) {
        return <Navigate to={ROLE_HOME[user.role]} replace />;
    }

    return <>{children}</>;
};
