import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import NavBar from '../components/Navbar'
import SongCard from '../components/SongCard'
import axios from "axios"

function PlaylistDetail(props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [playlist, setPlaylist] = useState({})
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [duration, setDuration] = useState(0)

  const params = useParams()
  const playlistId = Number(params.id)

  useEffect(() => {
    async function loadPlaylist() {
      try {
        const response = await fetch(`http://localhost:3000/api/playlists/${playlistId}`)
        if (!response.ok) {
          throw new Error("Failed to load playlist:", response.status)
        }
        const data = await response.json()
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

  function handleTitleInput(event) {
    const input = event.target
    const value = input.value
    //console.log("title:", value)
    setTitle(value)
  }

  function handleArtistInput(event) {
    const input = event.target
    const value = input.value
    //console.log("artist:", value)
    setArtist(value)
  }

  function handleDurationInput(event) {
    const input = event.target
    const value = input.value
    //console.log("duration:", value)

    // TODO: Optimize this the XX:XX does not work yet.
    function convertToNum(val) {
      const invalid = -1
      if (Number.isNaN(Number(val))) {
        // Is a string
        console.log("Is a string.")
        if (!value.includes(':')) {
          return invalid
        }

      } else {
        // Is a number
        console.log("Is a number.")
        return Number(value)
      }
      return invalid
    }
    
    // If value is in the format HH:MM:SS convert it into a number.
    // Makes sense to save it as a number since the backend only deals with integers for duration.
    const converted = convertToNum(value)
    console.log(converted)
    setDuration(converted)
  }

  async function handleAddSong(event) {
    event.preventDefault()
    // console.log("title:", title)
    // console.log("artist:", artist)
    // console.log("duration:", duration)

    function isValid() {
      if (title.length <= 0) {
        return false
      }
      if (artist.length <= 0) {
        return false
      }
      if (duration <= 0) {
        return false
      }
      return true
    }

    const valid = isValid()
    if (valid) {   
      const body = {
        title: title,
        artist: artist,
        duration: duration,
        playlistId: playlistId,
      }

      const response = await axios.post(`http://localhost:3000/api/songs/?playlistId=${playlistId}`, body)
      const newSong = await response.data
      playlist.Songs.push(newSong)

      setPlaylist(playlist)
      setTitle('')
      setArtist('')
      setDuration('')

    } else {
      console.log("ERROR: Some input is invalid")
    }
  }

  async function handleRemoveSong(event, songId) {
    //console.log("Song ID:", songId)
    const response = await axios.delete(`http://localhost:3000/api/songs/${songId}`, {
      params: {songid: songId}
    })
    const updatedSongs = playlist.Songs.filter((song) => {return song.id !== songId})
    // console.log("BEFORE", playlist.Songs)
    // playlist.Songs = updatedSongs
    // console.log("AFTER", playlist.Songs)
    setPlaylist({...playlist, Songs: updatedSongs})
  }

  if (loading) return <p> Loading Playlist...</p>
  if (error) return <p> Error: {error} </p>

  return (
    <>
      <Link to="/"> Back to playlists </Link>
      <h3>{playlist.title}</h3>
      <p>{playlist.description}</p>
      <h3>Add New Song</h3>

      {/* Wrap inputs in a form so when the button is pressed */}
      <form onSubmit={(event) => handleAddSong(event)}>
        {/* Input given here should just be a string */}
        <input type='text' placeholder='Title' onChange={(event) => handleTitleInput(event)} />
        
        {/* Input given here should just be a string */}
        <input type='text' placeholder='Artist' onChange={(event) => handleArtistInput(event)} /> 

        {/* Input given here should either be an integer in seconds or the format XX:XX */}
        <input type='duration' placeholder='Duration' onChange={(event) => handleDurationInput(event)} /> 
        
        <button type='submit'> Add Song </button>
      </form>

      <h3>Songs</h3>

      {!loading && playlist?.Songs && (
        <div className="grid">
          {playlist.Songs.map((song) => {
            return (
              <SongCard
                key={song.id}
                song={song}
                onRemove={handleRemoveSong}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

export default PlaylistDetail
