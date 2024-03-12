import './App.css';
import {BrowserRouter,Route, Routes } from "react-router-dom"
import Dashboard from './pages/admin/dashboard/Dashboard';
import Authentication from './pages/authentication/Authentication';
import { Toaster } from 'sonner'

import Home from './pages/admin/home/Home';
import AddEmail from './pages/admin/Email/Add/AddEmail';
import CreateSimpleEmail from './pages/admin/Email/create/CreateSimpleEmail';
import EmailDragAndDrop from './pages/admin/Email/emailEditor/EmailDragAndDrop';
import ListEmails from './pages/admin/Email/list/ListEmails';
import Layout from './Layout';
import ListUsers from './pages/admin/users/list/ListUsers';
function App() {
  return (
    <div className="App">
      <Toaster richColors position="top-right"  />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            <Route index element={<Home/>} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/addEmailTemplate' element={<AddEmail />} />
            <Route path='/home' element={<Home />} />
            <Route path='/addSimpleEmail' element={<CreateSimpleEmail />} />
            <Route path='/createTemplate' element={<EmailDragAndDrop />} />
            <Route path='/listEmailTemplates' element={<ListEmails />} />
            <Route path='/listUsers' element={<ListUsers />} />
          </Route> 
          <Route path='/authentication' element={<Authentication />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
