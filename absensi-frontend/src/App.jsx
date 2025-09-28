import React from 'react'
import Login from './components/Login'
import { BrowserRouter, Routes, Route } from 'react-router'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import Employees from './components/Employees'
import EmployeeForm from './components/EmployeeForm'
import { UserProvider } from './contexts/UserContext'
import Attendances from './components/Attendances'


const App = () => {
  return (
    <UserProvider>
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/create" element={<EmployeeForm />} />
        <Route path="/employees/edit/:id" element={<EmployeeForm />} />
        <Route path="/attendances" element={<Attendances />} />
      </Routes>
    </BrowserRouter>
    </UserProvider>
  )
}

export default App