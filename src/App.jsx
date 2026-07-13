import { useState, useEffect } from 'react'
import {Routes, Route} from 'react-router'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PlaylistDetail from './pages/PlaylistDetail'
import './App.css'

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/playlists/:id" element={<PlaylistDetail/>}/>
          <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
