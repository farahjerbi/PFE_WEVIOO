import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ADD_ADVANCED_EMAIL_TEMPLATE, ADD_EMAIL_TEMPLATE, ADD_SIMPLE_EMAIL_TEMPLATE, AUTHENTICATION, CALENDAR, DASHBOARD, EDIT_EMAIL_TEMPLATE, EMAILS_STATISTICS, LIST_EMAIL_TEMPLATES, LIST_USERS, PROFILE, SEND_EMAIL, SEND_EMAIL_SCHEDULED, USERS_STATISTICS } from "./routes/paths";
import { decodeToken, selectIsAuth, selectRole } from "./redux/state/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Role } from "./models/Role";
import { AppDispatch } from "./redux/store";
import Loading from "./components/loading/Loading"; 
// Lazy load components
const Dashboard = React.lazy(() => import('./pages/admin/dashboard/Dashboard'));
const Authentication = React.lazy(() => import('./pages/authentication/Authentication'));
const AddEmail = React.lazy(() => import('./pages/admin/Email/Add/AddEmail'));
const CreateSimpleEmail = React.lazy(() => import('./pages/admin/Email/create/CreateSimpleEmail'));
const EmailDragAndDrop = React.lazy(() => import('./pages/admin/Email/emailEditor/EmailDragAndDrop'));
const ListEmails = React.lazy(() => import('./pages/admin/Email/list/ListEmails'));
const Layout = React.lazy(() => import('./routes/Layout'));
const ListUsers = React.lazy(() => import('./pages/admin/users/list/ListUsers'));
const UsersStatistics = React.lazy(() => import('./pages/admin/users/statistics/UsersStatistics'));
const EmailStatistics = React.lazy(() => import('./pages/admin/Email/statistics/EmailStatistics'));
const ProtectedRoute = React.lazy(() => import('./routes/ProtectedRoute'));
const Profile = React.lazy(() => import('./pages/user/profile/Profile'));
const SendSimpleEmail = React.lazy(() => import('./pages/user/email/sendSimpleEmail/SendSimpleEmail'));
const UpdateEmail = React.lazy(() => import('./pages/admin/Email/update/UpdateEmail'));
const Calendar = React.lazy(() => import('./pages/admin/Email/calendar/Calendar'));
const ForgotPassword = React.lazy(() => import('./pages/authentication/forgotPassword/ForgotPassword'));
const NotFound = React.lazy(() => import('./components/404Error/NotFound'));



function App() {
  const dispatch: AppDispatch = useDispatch(); 
  useEffect(() => {
    dispatch(decodeToken());
  }, [dispatch]);
  const isAuth = useSelector(selectIsAuth);
  const role=useSelector(selectRole)
  return (
    <div className="App">
      <Toaster richColors position="top-right"  />
      <BrowserRouter>
      <Suspense fallback={<Loading />}>
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
        </Suspense>
      </BrowserRouter>
    </div>
  );
}
export default App;
