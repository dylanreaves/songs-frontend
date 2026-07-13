import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import NavBar from '../components/Navbar'
import SongCard from '../components/SongCard'

function PlaylistDetail(props) {
  const [playlist, setPlaylist] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const params = useParams()
  const id = Number(params.id)

  useEffect(() => {
    async function loadPlaylist() {
      try {
        const response = await fetch(`http://localhost:3000/api/playlists/${id}`)
        if (!response.ok) {
          throw new Error("Failed to load playlist:", response.status)
        }
        const data = await response.json()
        console.log(data)
        if (!data) {
          throw new Error("Failed to get playlist:", response.status)
        }

        setPlaylist(data)

      } catch(error) {
        console.log(error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    loadPlaylist()
  }, [])

  if (loading) return <p> Loading Playlist...</p>
  if (error) return <p> Error: {error} </p>

  return (
    <>
      <Link to="/"> Back to playlists </Link>

      <h3>{playlist.title}</h3>
      <p>{playlist.description}</p>

      <h3>Add New Song</h3>
      <input placeholder='Title' />
      <input placeholder='Artist' /> 
      <input placeholder='Duration' /> 
      <button> Add Song </button>

      <h3>Songs</h3>

      {!loading && playlist?.Songs && (
        <div className="grid">
          {playlist.Songs.map((song) => {
            return (
              <SongCard
                key={song.id}
                song={song}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

export default PlaylistDetail
