import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { GlobalStyle } from './GlobalStyled.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Navbar } from "../src/components/Navbar/Navbar"
import { Home } from "../src/pages/Home/Home"
import { Register } from './pages/Register/Register'
import { Login } from './pages/Login/Login'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './services/queryClient.js';
import UserProvider from './context/UserContext'
import "bootstrap-icons/font/bootstrap-icons.css";
import { MainPage } from './pages/MainPage/MainPage'
import { ReactNotifications } from 'react-notifications-component'

const router = createBrowserRouter([
  {
    path: "/", // rota mãe
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/app",
        element: <MainPage />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyle />

    <UserProvider>

      <QueryClientProvider client={queryClient}>
        <ReactNotifications />
        <RouterProvider router={router}/> 
      </QueryClientProvider>

    </UserProvider>

  </React.StrictMode>,
)
