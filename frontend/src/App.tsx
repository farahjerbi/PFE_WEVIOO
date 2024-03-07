import './App.css';
import {BrowserRouter,Route, Routes,Navigate, useLocation, Outlet } from "react-router-dom"
import Dashboard from './pages/dashboard/Dashboard';
import Authentication from './pages/authentication/Authentication';
import { Toaster } from 'sonner'
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import Home from './pages/admin/home/Home';
import AddEmail from './pages/admin/Email/Add/AddEmail';
import CreateSimpleEmail from './pages/admin/Email/create/CreateSimpleEmail';
import EmailDragAndDrop from './pages/admin/Email/emailEditor/EmailDragAndDrop';
function App() {

  return (
    <div className="App">
      <Toaster richColors position="top-right"  />
      <BrowserRouter>
        <Navbar />
        <Sidebar /> 
        <Routes>
          <Route path='/authentication' element={<Authentication />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/addEmailTemplate' element={<AddEmail />} />
          <Route path='/home' element={<Home />} />
          <Route path='/addSimpleEmail' element={<CreateSimpleEmail />} />
          <Route path='/createTemplate' element={<EmailDragAndDrop />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
