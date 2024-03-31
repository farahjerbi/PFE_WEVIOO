import {BrowserRouter,Navigate,Route, Routes } from "react-router-dom"
import Dashboard from './pages/admin/dashboard/Dashboard';
import Authentication from './pages/authentication/Authentication';
import { Toaster } from 'sonner'

import AddEmail from './pages/admin/Email/Add/AddEmail';
import CreateSimpleEmail from './pages/admin/Email/create/CreateSimpleEmail';
import EmailDragAndDrop from './pages/admin/Email/emailEditor/EmailDragAndDrop';
import ListEmails from './pages/admin/Email/list/ListEmails';
import Layout from './routes/Layout';
import ListUsers from './pages/admin/users/list/ListUsers';
import UsersStatistics from './pages/admin/users/statistics/UsersStatistics';
import EmailStatistics from './pages/admin/Email/statistics/EmailStatistics';
import ProtectedRoute from './routes/ProtectedRoute';
import Profile from "./pages/user/profile/Profile";
import SendSimpleEmail from "./pages/user/email/sendSimpleEmail/SendSimpleEmail";
import UpdateEmail from "./pages/admin/Email/update/UpdateEmail";
import Calendar from "./pages/admin/Email/calendar/Calendar";
import ForgotPassword from "./pages/authentication/forgotPassword/ForgotPassword";
import { ADD_ADVANCED_EMAIL_TEMPLATE, ADD_EMAIL_TEMPLATE, ADD_SIMPLE_EMAIL_TEMPLATE, AUTHENTICATION, CALENDAR, DASHBOARD, EDIT_EMAIL_TEMPLATE, EMAILS_STATISTICS, LIST_EMAIL_TEMPLATES, LIST_USERS, PROFILE, SEND_EMAIL, SEND_EMAIL_SCHEDULED, USERS_STATISTICS } from "./routes/paths";
import { selectIsAuth, selectRole } from "./redux/state/authSlice";
import { useSelector } from "react-redux";
import { Role } from "./models/Role";
import NotFound from "./components/404Error/NotFound";

function App() {
  const isAuth = useSelector(selectIsAuth);
  const role=useSelector(selectRole)
  return (
    <div className="App">
      <Toaster richColors position="top-right"  />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
                    <Route path={DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path={PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path={LIST_EMAIL_TEMPLATES} element={<ProtectedRoute><ListEmails /></ProtectedRoute>} />                 
                    <Route path={CALENDAR} element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                    <Route path={EMAILS_STATISTICS} element={<ProtectedRoute><EmailStatistics /></ProtectedRoute>} />
                    <Route path='*' element={<NotFound />} />

                  {role===Role.ADMIN && ( <>
                    <Route path={ADD_EMAIL_TEMPLATE} element={<ProtectedRoute><AddEmail /></ProtectedRoute>} />
                     <Route path={ADD_SIMPLE_EMAIL_TEMPLATE} element={<ProtectedRoute><CreateSimpleEmail /></ProtectedRoute>} />
                      <Route path={ADD_ADVANCED_EMAIL_TEMPLATE} element={<ProtectedRoute><EmailDragAndDrop /></ProtectedRoute>} />
                                      <Route path={LIST_USERS} element={<ProtectedRoute><ListUsers /></ProtectedRoute>} />
                                      <Route path={USERS_STATISTICS} element={<ProtectedRoute><UsersStatistics /></ProtectedRoute>} />
                                      <Route path={`${EDIT_EMAIL_TEMPLATE}/:id`} element={<ProtectedRoute><UpdateEmail /></ProtectedRoute>} />
                  </>)}
              

                  {role===Role.USER && ( <>

                    <Route path={`${SEND_EMAIL_SCHEDULED}/:id`}
                    element={<ProtectedRoute><SendSimpleEmail isScheduled={true} /></ProtectedRoute>} />
                    <Route path={`${SEND_EMAIL}/:id`}
                    element={<ProtectedRoute><SendSimpleEmail isScheduled={false} /></ProtectedRoute>} />
                                      </>)}
          </Route> 
              <Route path={AUTHENTICATION} element={!isAuth? <Authentication />:<Navigate to={DASHBOARD} />} />
              <Route path='/forgotPassword/:email' element={<ForgotPassword />} />
              <Route path={`${AUTHENTICATION}/:emailUser`} element={<Authentication />} />
              <Route path="" element={<Navigate to={AUTHENTICATION} replace/> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
