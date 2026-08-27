import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Features from './pages/Features';
import Developers from './pages/Developers';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import PortfolioPublic from './pages/PortfolioPublic';
import Login from './pages/Login';
import Register from './pages/Register';

import StudentHome from './pages/student/StudentHome';
import StudentProfile from './pages/student/StudentProfile';
import StudentPortfolio from './pages/student/StudentPortfolio';
import StudentResume from './pages/student/StudentResume';
import StudentAI from './pages/student/StudentAI';
import StudentAnalytics from './pages/student/StudentAnalytics';
import StudentApplications from './pages/student/StudentApplications';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';

import EmployerHome from './pages/employer/EmployerHome';
import EmployerCompany from './pages/employer/Company';
import EmployerJobs from './pages/employer/Jobs';
import EmployerApplications from './pages/employer/Applications';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="features" element={<Features />} />
            <Route path="developers" element={<Developers />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="companies" element={<Companies />} />
            <Route path="portfolio/:id" element={<PortfolioPublic />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route
            path="/student/*"
            element={
              <ProtectedRoute role="student">
                <DashboardLayout role="student" />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentHome />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="portfolio" element={<StudentPortfolio />} />
            <Route path="resume" element={<StudentResume />} />
            <Route path="ai" element={<StudentAI />} />
            <Route path="analytics" element={<StudentAnalytics />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="chat" element={<Chat />} />
            <Route path="jobs" element={<Jobs />} />
          </Route>

          <Route
            path="/employer/*"
            element={
              <ProtectedRoute role="employer">
                <DashboardLayout role="employer" />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployerHome />} />
            <Route path="company" element={<EmployerCompany />} />
            <Route path="jobs" element={<EmployerJobs />} />
            <Route path="applications" element={<EmployerApplications />} />
            <Route path="chat" element={<Chat />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
