import { Navigate, type RouteObject } from 'react-router-dom'
import LandingPage from '../../pages/LandingPage'
import LoginPage from '../../pages/LoginPage'
import SignupPage from '../../pages/SignupPage'
import ForgotPasswordPage from '../../pages/ForgotPasswordPage'
import SubmissionPage from '../../pages/SubmissionPage'
import DashboardPage from '../../pages/DashboardPage'
import SubmissionDetailPage from '../../pages/SubmissionDetailPage'
import ReviewerDashboardPage from '../../pages/ReviewerDashboardPage'
import ReviewConceptPage from '../../pages/ReviewConceptPage'
import SubmitReviewPage from '../../pages/SubmitReviewPage'
import ReviewSubmittedPage from '../../pages/ReviewSubmittedPage'
import EditConceptPage from '../../pages/EditConceptPage'
import UsersPage from '../../pages/tenant-admin/UsersPage'
import RolesPermissionsPage from '../../pages/tenant-admin/RolesPermissionsPage'
import WorkflowStagesPage from '../../pages/tenant-admin/WorkflowStagesPage'
import StatusManagementPage from '../../pages/tenant-admin/StatusManagementPage'
import EmailTriggersPage from '../../pages/tenant-admin/EmailTriggersPage'
import FormBuilderPage from '../../pages/tenant-admin/FormBuilderPage'
import CreateFormBuilderPage from '../../pages/tenant-admin/CreateFormBuilderPage'
import AuditLogsPage from '../../pages/tenant-admin/AuditLogsPage'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'

export const appRoutes: RouteObject[] = [
  // ── Guest-only (redirect authenticated users to their role home) ──────────
  { path: '/',       element: <GuestRoute><LoginPage variant="external" /></GuestRoute> },
  { path: '/signin', element: <GuestRoute><LoginPage variant="staff"    /></GuestRoute> },
  { path: '/signup',           element: <GuestRoute><SignupPage /></GuestRoute> },
  { path: '/forgot-password', element: <GuestRoute><ForgotPasswordPage /></GuestRoute> },

  // ── External scientist ────────────────────────────────────────────────────
  { path: '/home',       element: <ProtectedRoute allowedRoles={['external_scientist']}><LandingPage /></ProtectedRoute> },
  { path: '/submission', element: <ProtectedRoute allowedRoles={['external_scientist', 'keystone_member']}><SubmissionPage /></ProtectedRoute> },

  // ── Shared dashboard ──────────────────────────────────────────────────────
  { path: '/dashboard',          element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: '/dashboard/:id',      element: <ProtectedRoute><SubmissionDetailPage /></ProtectedRoute> },
  { path: '/dashboard/:id/edit', element: <ProtectedRoute><EditConceptPage /></ProtectedRoute> },

  // ── Reviewer (keystone_member only) ──────────────────────────────────────
  { path: '/reviewer/dashboard',                    element: <ProtectedRoute allowedRoles={['keystone_member']}><ReviewerDashboardPage /></ProtectedRoute> },
  { path: '/reviewer/review/:conceptId',            element: <ProtectedRoute allowedRoles={['keystone_member']}><ReviewConceptPage /></ProtectedRoute> },
  { path: '/reviewer/review/:conceptId/submit',     element: <ProtectedRoute allowedRoles={['keystone_member']}><SubmitReviewPage /></ProtectedRoute> },
  { path: '/reviewer/review/:conceptId/submitted',  element: <ProtectedRoute allowedRoles={['keystone_member']}><ReviewSubmittedPage /></ProtectedRoute> },

  // ── Tenant Admin ──────────────────────────────────────────────────────────
  { path: '/tenant-admin/users',             element: <ProtectedRoute allowedRoles={['tenant_admin']}><UsersPage /></ProtectedRoute> },
  { path: '/tenant-admin/roles-permissions', element: <ProtectedRoute allowedRoles={['tenant_admin']}><RolesPermissionsPage /></ProtectedRoute> },
  { path: '/tenant-admin/workflow-stages',   element: <ProtectedRoute allowedRoles={['tenant_admin']}><WorkflowStagesPage /></ProtectedRoute> },
  { path: '/tenant-admin/status-management', element: <ProtectedRoute allowedRoles={['tenant_admin']}><StatusManagementPage /></ProtectedRoute> },
  { path: '/tenant-admin/email-triggers',    element: <ProtectedRoute allowedRoles={['tenant_admin']}><EmailTriggersPage /></ProtectedRoute> },
  { path: '/tenant-admin/form-builder',             element: <ProtectedRoute allowedRoles={['tenant_admin']}><FormBuilderPage /></ProtectedRoute> },
  { path: '/tenant-admin/form-builder/create/:type', element: <ProtectedRoute allowedRoles={['tenant_admin']}><CreateFormBuilderPage /></ProtectedRoute> },
  { path: '/tenant-admin/audit-logs',        element: <ProtectedRoute allowedRoles={['tenant_admin']}><AuditLogsPage /></ProtectedRoute> },

  // ── Catch-all ─────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
]
