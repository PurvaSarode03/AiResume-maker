import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'

import Home from './pages/Home'
import About from './pages/About'
import Root  from './pages/Root'
import Services from './pages/Services'
import Contact from './pages/Contact'
import GenerateResume from './pages/GenerateResume'
import { ToastBar, Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
   <Toaster/>
   <Routes>
   <Route path="/" element={<Root/>}>
     <Route path="" element={<Home/>}/>
     <Route path="about" element={<About/>}/>
     <Route path="service" element={<Services/>}/>
     <Route path="contact" element={<Contact/>}/>
     <Route path="generate-resume" element={<GenerateResume/>}/>
  </Route>
</Routes>
</BrowserRouter>
  </StrictMode>
);
