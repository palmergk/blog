import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/general/HomePage'
import Login from './pages/general/Login'
import Profile from './pages/admin/Profile'
import Signup from './pages/general/Signup'
import AllBlogs from './pages/admin/AllBlogs'
import CreateBlogs from './pages/admin/CreateBlogs'
import EditBlogs from './pages/admin/EditBlogs'
import BlogPage from './pages/general/BlogPage'
import BlogUser from './pages/general/BlogUser'
import AuthRoutes from './services/AuthRoutes'
import VerifyAccount from './pages/general/VerifyAccount'
import ForgotPassword from './pages/general/ForgotPassword'
import AllRoutes from './services/AllRoutes'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<AllRoutes><HomePage/></AllRoutes>} />
      <Route path="/blog/:id/:slug" element={<AllRoutes><BlogPage/></AllRoutes>} />
      <Route path="/blog/:userid/user" element={<BlogUser/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<AuthRoutes><Profile/></AuthRoutes>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/verify" element={<VerifyAccount/>} />
      <Route path="/blog" element={<AuthRoutes><AllBlogs/></AuthRoutes>} />
      <Route path="/blog/new" element={<AuthRoutes><CreateBlogs/></AuthRoutes>} />
      <Route path="/blog/:id/edit" element={<AuthRoutes><EditBlogs/></AuthRoutes>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App