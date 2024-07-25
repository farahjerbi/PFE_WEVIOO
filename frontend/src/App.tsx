import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ADD_ADVANCED_EMAIL_TEMPLATE, ADD_EMAIL_TEMPLATE, ADD_SIMPLE_EMAIL_TEMPLATE, AUTHENTICATION, CALENDAR, DASHBOARD, EDIT_EMAIL_TEMPLATE, EMAILS_STATISTICS, LIST_EMAIL_TEMPLATES, LIST_USERS, PROFILE, SEND_EMAIL, SEND_EMAIL_SCHEDULED, USERS_STATISTICS,SAVEDTEMPLATES, LIST_SMS_TEMPLATES, ADD_SMS_TEMPLATE, CREATE_SMS_TEMPLATE, CREATE_WHATSAPP_TEMPLATE, UPDATE_SMS_TEMPLATE, SEND_SMS, SEND_WHATSAPP, LIST_PUSH_TEMPLATES, CONTACT, SEND_SMS_SEPARATELY, SEND_WHATSAPP_SEPARATELY, SEND_PUSH_SEPARATELY, SEARCH } from "./routes/paths";
import { decodeToken, selectIsAuth, selectRole } from "./redux/state/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Role } from "./models/user/Role";
import { AppDispatch } from "./redux/store";
import Loading from "./components/loading/Loading"; 
import AddSMS from './pages/admin/sms/add/AddSMS';
import CreateWhatsapp from './pages/admin/sms/createWhatsapp/CreateWhatsapp';
import { NotificationType } from './models/NotificationType';
import SendPushSeparately from './pages/admin/push/sendSeparately/SendPushSeparately';
// Lazy load components
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const Authentication = React.lazy(() => import('./pages/authentication/Authentication'));
const AddEmail = React.lazy(() => import('./pages/admin/Email/Add/AddEmail'));
const CreateSimpleTemplate = React.lazy(() => import('./pages/admin/Email/create/CreateSimpleTemplate'));
const EmailDragAndDrop = React.lazy(() => import('./pages/admin/Email/emailEditor/EmailDragAndDrop'));
const ListEmails = React.lazy(() => import('./pages/admin/Email/list/ListEmails'));
const ListSMS = React.lazy(() => import('./pages/admin/sms/listSMS/ListSMS'));
const Layout = React.lazy(() => import('./routes/Layout'));
const ListUsers = React.lazy(() => import('./pages/admin/users/list/ListUsers'));
const UsersStatistics = React.lazy(() => import('./pages/admin/users/statistics/UsersStatistics'));
const EmailStatistics = React.lazy(() => import('./pages/admin/Email/statistics/EmailStatistics'));
const ProtectedRoute = React.lazy(() => import('./routes/ProtectedRoute'));
const Profile = React.lazy(() => import('./pages/user/profile/Profile'));
const SendSimpleEmail = React.lazy(() => import('./pages/user/email/sendSimpleEmail/SendSimpleEmail'));
const UpdateEmail = React.lazy(() => import('./pages/admin/Email/update/UpdateEmail'));
const UpdateSMS = React.lazy(() => import('./pages/admin/sms/update/UpdateSMS'));
const Scheduled = React.lazy(() => import('./pages/scheduled/Scheduled'));
const ForgotPassword = React.lazy(() => import('./pages/authentication/forgotPassword/ForgotPassword'));
const NotFound = React.lazy(() => import('./components/404Error/NotFound'));
const SavedTemplates = React.lazy(() => import('./pages/user/email/savedTemplates/SavedTemplates'));
const SendSMS = React.lazy(() => import('./pages/user/sms/sendSMS/SendSMS'));
const SendWhatsapp = React.lazy(() => import('./pages/user/sms/sendWhatsapp/SendWhatsapp'));
const PushNotification = React.lazy(() => import('./components/PushNotification/PushNotification'));
const Contact=React.lazy(() => import('./pages/user/contact/Contacts'));
const SendSeparately = React.lazy(() => import('./pages/user/sms/sendSeparately/SendSeparately'));
const SearchAI = React.lazy(() => import('./components/search/SearchAI'));



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
                    <Route path={CALENDAR} element={<ProtectedRoute><Scheduled /></ProtectedRoute>} />
                    <Route path={EMAILS_STATISTICS} element={<ProtectedRoute><EmailStatistics /></ProtectedRoute>} />
                    <Route path='*' element={<NotFound />} />
                    <Route path={LIST_SMS_TEMPLATES} element={<ProtectedRoute><ListSMS /></ProtectedRoute>} />
                    <Route path={LIST_PUSH_TEMPLATES} element={<ProtectedRoute><PushNotification /></ProtectedRoute>}/>
                    <Route path={SEARCH} element={<ProtectedRoute><SearchAI /></ProtectedRoute>}/>

                  {role===Role.ADMIN && ( <>
                    <Route path={ADD_EMAIL_TEMPLATE} element={<ProtectedRoute><AddEmail /></ProtectedRoute>} />
                     <Route path={ADD_SIMPLE_EMAIL_TEMPLATE} element={<ProtectedRoute><CreateSimpleTemplate /></ProtectedRoute>} />
                     <Route path={CREATE_WHATSAPP_TEMPLATE} element={<ProtectedRoute><CreateWhatsapp /></ProtectedRoute>} />
                     <Route path={CREATE_SMS_TEMPLATE} element={<ProtectedRoute><CreateSimpleTemplate /></ProtectedRoute>} />
                     <Route path={ADD_SMS_TEMPLATE} element={<ProtectedRoute><AddSMS /></ProtectedRoute>} />
                      <Route path={ADD_ADVANCED_EMAIL_TEMPLATE} element={<ProtectedRoute><EmailDragAndDrop /></ProtectedRoute>} />
                                      <Route path={LIST_USERS} element={<ProtectedRoute><ListUsers /></ProtectedRoute>} />
                                      <Route path={USERS_STATISTICS} element={<ProtectedRoute><UsersStatistics /></ProtectedRoute>} />
                                      <Route path={`${EDIT_EMAIL_TEMPLATE}/:id`} element={<ProtectedRoute><UpdateEmail /></ProtectedRoute>} />
                                      <Route path={`${UPDATE_SMS_TEMPLATE}/:id`} element={<ProtectedRoute><UpdateSMS /></ProtectedRoute>} />

                  </>)}

                  {role===Role.USER && ( <>
                    <Route path={SAVEDTEMPLATES} element={<ProtectedRoute><SavedTemplates /></ProtectedRoute>} />
                    <Route path={CONTACT} element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                    <Route path={`${SEND_WHATSAPP}/:id`} element={<ProtectedRoute><SendWhatsapp /></ProtectedRoute>} />
                    <Route path={`${SEND_EMAIL_SCHEDULED}/:id`}
                    element={<ProtectedRoute><SendSimpleEmail isScheduled={true} /></ProtectedRoute>} />
                    <Route path={`${SEND_SMS}/:id`}
                    element={<ProtectedRoute><SendSMS /></ProtectedRoute>} />
                         <Route path={`${SEND_PUSH_SEPARATELY}/:id`}
                    element={<ProtectedRoute><SendPushSeparately /></ProtectedRoute>} />
                      <Route path={`${SEND_SMS_SEPARATELY}/:id`}
                    element={<ProtectedRoute><SendSeparately type={NotificationType.SMS} /></ProtectedRoute>} />
                     <Route path={`${SEND_WHATSAPP_SEPARATELY}/:id`}
                    element={<ProtectedRoute><SendSeparately type={NotificationType.WHATSAPP} /></ProtectedRoute>} />
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
