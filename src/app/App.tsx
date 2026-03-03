import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import SubmissionPage from '../pages/SubmissionPage'
import DashboardPage from '../pages/DashboardPage'
import ReviewerDashboardPage from '../pages/ReviewerDashboardPage'
import ReviewConceptPage from '../pages/ReviewConceptPage'
import SubmitReviewPage from '../pages/SubmitReviewPage'
import ReviewSubmittedPage from '../pages/ReviewSubmittedPage'
import { ProtectedRoute } from './router/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/submission"
          element={
            <ProtectedRoute allowedRoles={['external_scientist', 'keystone_member']}>
              <SubmissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/dashboard"
          element={<ReviewerDashboardPage />}
        />
        <Route
          path="/reviewer/review/:conceptId"
          element={<ReviewConceptPage />}
        />
        <Route
          path="/reviewer/review/:conceptId/submit"
          element={<SubmitReviewPage />}
        />
        <Route
          path="/reviewer/review/:conceptId/submitted"
          element={<ReviewSubmittedPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
