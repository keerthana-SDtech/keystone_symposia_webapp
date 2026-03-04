import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../providers/useAuthContext';
import { ROLE_HOME } from './roleHome';
import type { UserRole } from '../../features/auth/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuthContext();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={ROLE_HOME[user.role]} replace />;
    }

    return <>{children}</>;
};
