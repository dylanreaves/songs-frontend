import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import NavBar from '../components/Navbar'
import SongCard from '../components/SongCard'
import axios from "axios"

function PlaylistDetail(props) {
  const navigate = useNavigate()
  // const playlists = props.playlists
  // const setPlaylists = props.setPlaylists
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [playlist, setPlaylist] = useState({})
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [duration, setDuration] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const params = useParams()
  const playlistId = Number(params.id)

  const BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    async function loadPlaylist() {
      try {
        const response = await fetch(BASE_URL + `/api/playlists/${playlistId}`)
        if (!response.ok) {
          navigate('*')
          throw new Error("Failed to load playlist:", response.status)
        }
        const data = await response.json()
        if (!data) {
          navigate('*')
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

  function handleRemovePlaylist() {
    if (!confirmDelete) {
      // Prompt confirmation
      setConfirmDelete(true)
    } else {
      // Remove the playlist
      async function remove() {
        const response = await axios.delete(BASE_URL + `/api/playlists/${playlistId}`)
        if (response.status === 204) {
          // Problem: can't use setPlaylists here because it's 
          // undefined and we need to get it from Home.jsx
          // setPlaylists(prev => {
          //   return prev.map((playlist) => {
          //     return Number(playlist.id) !== playlistId
          //   })
          // })
          
          // Solution: We don't actually have to filter here we can just navigate back to home
          // after the playlist gets deleted.
          navigate('/')
        }
      }

      remove()
    }
  }

  // Stores all validation functions required by inputs in a single object for quick access.
  const validationFuncs = {}
  validationFuncs["Duration"] = function convertToNum(val) {
    // If value is in the format HH:MM:SS convert it into a number.
    // Makes sense to save it as a number since the backend only deals with integers for duration.
    const invalid = -1
    if (Number.isNaN(Number(val))) {
      //console.log("Is a string.")
      if (!val.includes(':')) {
        return invalid
      }

      // Split formatted time by the ':' and reverse it so we have SS:MM:HH instead of HH:MM:SS
      const split_Time = val.split(':').reverse().map(Number)
      const seconds = split_Time[0] || 0
      const mins = split_Time[1] || 0
      const hours = split_Time[2] || 0
      return (hours * 3600) + (mins * 60) + seconds
    } else {
      // console.log("Is a number.")
      return Number(val)
    }
    return invalid
  }

  //console.log(validationFuncs.duration)

  function handleInput(event, propreties) {
    const input = event.target
    const value = input.value
    // console.log("title:", value)

    const validFunc = validationFuncs[propreties.input_type]
    const setFunc = propreties.setFunc

    // If a validation function exists run it and store the value otherwise default to the old value
    const newValue = validFunc ? validFunc(value) : value
    newValue ? setFunc(newValue) : setFunc(value)
  }

  async function handleAddSong(event) {
    event.preventDefault()
    // console.log("title:", title)
    // console.log("artist:", artist)
    // console.log("duration:", duration)

    function isValid() {
      if (title.length <= 0 || artist.length <= 0 || duration <= 0) {
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

      const response = await axios.post(BASE_URL + `/api/songs/?playlistId=${playlistId}`, body)
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
    // console.log("Song ID:", songId)
    const response = await axios.delete(BASE_URL + `/api/songs/${songId}`, {
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
        <input type='text' placeholder='Title' onChange={(event) => handleInput(event, {setFunc: setTitle, input_type: "Title"})} />
        
        {/* Input given here should just be a string */}
        <input type='text' placeholder='Artist' onChange={(event) => handleInput(event, {setFunc: setArtist, input_type: "Artist"})} /> 

        {/* Input given here should either be an integer in seconds or the format XX:XX */}
        <input type='duration' placeholder='Duration' onChange={(event) => handleInput(event, {setFunc: setDuration, input_type: "Duration"})} /> 
        
        <button type='submit'> Add Song </button>
      </form>

      <h3>Songs</h3>

      {/* Loads song cards on a given playlist */}
      {!loading && playlist?.Songs && (
        <div className="grid">
          {playlist.Songs.map((song) => {
            return (
              <SongCard
                class="song_card"
                key={song.id}
                song={song}
                onRemove={handleRemoveSong}
              />
            )
          })}
        </div>
      )}

      {/* Delete button changes based on confirmDelete useState */}
      {confirmDelete ? (
        <div>
          <button className="removeButton" onClick={(event) => handleRemovePlaylist(event)}> Confirm Delete </button>
          <button onClick={() => setConfirmDelete(false)}> Cancel </button>
        </div>
      ) : (
        <button className="removeButton" onClick={(event) => handleRemovePlaylist(event)}> Delete Playlist </button>
      )}
    </>
  )
}

export default PlaylistDetail
