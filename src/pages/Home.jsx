import { useEffect, useState } from 'react'
import NavBar from '../components/Navbar'
import PlaylistCell from '../components/PlaylistCard'

function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    async function loadPlaylists() {
      try {
        const response = await fetch(`http://localhost:3000/api/playlists`)
        if (!response.ok) {
          throw new Error("Failed to load playlists:", response.status)
        }
        const data = await response.json()
        console.log(data)
        if (!data) {
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
        <h3>All Playlists: </h3>
        <button> Create Playlist</button>
      </div>

      <div className="grid">
        {/* Map playlists here */}
        {playlists.map((list) => {
          return (
            <PlaylistCell 
              key={list.id}
              list={list}
            />
          )
        })

        }
      </div>
    </>
  )
}

export default Home
