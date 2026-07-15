import { useEffect, useState } from 'react'
import NavBar from '../components/Navbar'
import PlaylistCard from '../components/PlaylistCard'
import PlaylistForm from '../components/PlaylistForm'

function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [playlists, setPlaylists] = useState([])

  const BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    async function loadPlaylists() {
      try {
        const response = await fetch(BASE_URL + `/api/playlists`)
        if (!response.ok) {
          navigate('/*')
          throw new Error("Failed to load playlists:", response.status)
        }
        const data = await response.json()
        if (!data) {
          navigate('/*')
          throw new Error("Failed to get playlists:", response.status)
        }
        setPlaylists(data)
      } catch(error) {
        console.log(error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    loadPlaylists()
  }, [])

  if (loading) return <p> Loading Playlists... </p>
  if (error) return <p> Error: {error.message} </p>

  return (
    <>
      <NavBar></NavBar>

      <div>
        <h3> All Playlists </h3>
        <button> Create Playlist</button>
        <PlaylistForm 
          playlists={playlists} 
          setPlaylists={setPlaylists} 
          className="hidden" 
        />
      </div>

      <div className="grid">
        {/* Map playlists here */}
        {playlists.map((list) => {
          return (
            <PlaylistCard 
              key={list.id}
              list={list}
            />
          )
        })}
      </div>
    </>
  )
}

export default Home
