// App.jsx

import './App.css'
import Chatbot from './components/Chatbot'
import Sidebar from './components/Sidebar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Credit from './pages/Credit'
import Community from './pages/Community'
import { useState } from 'react'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'

function App() {
  const { user,loadingUser}= useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname}= useLocation()
  if(pathname==='/loading'|| loadingUser){
    return <Loading/>
  }

  return (
    <>
    <Toaster/>
      {/* Mobile menu button */}
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert z-40'
          onClick={() => setIsMenuOpen(true)}
          alt='menu'
        />
      )}
      {
        user? (
                <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='min-h-screen w-screen flex'>
          
          {/* Sidebar: fixed and width of 72 (18rem) */}
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          {/* Main content: fills remaining space with no extra margin/padding */}
          <main className='flex-1 ml-10 h-screen overflow-hidden'>
            <Routes>
              <Route path='/' element={<Chatbot />} />
              <Route path='/credits' element={<Credit />} />
              <Route path='/community' element={<Community />} />
            </Routes>
          </main>
        </div>
      </div>
        ):(
          <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'> 
            <Login/>
          </div>
        )
      }

      
    </>
  )
}

export default App
