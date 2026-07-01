import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DishPage from './pages/DishPage'
import { MenuProvider } from './context/MenuContext'

export default function App() {
  return (
    <MenuProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dish/:id" element={<DishPage />} />
      </Routes>
    </MenuProvider>
  )
}
