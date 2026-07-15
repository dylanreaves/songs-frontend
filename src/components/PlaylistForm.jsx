import { useState } from 'react'
import { Link } from 'react-router'
import axios from "axios"

function PlaylistForm(props) {
  const playlists = props.playlists
  const setPlaylists = props.setPlaylists
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  console.log(props)

  const BASE_URL = import.meta.env.VITE_API_URL

  function handleInput(event, propreties) {
    const input = event.target
    const value = input.value
    // console.log("title:", value)
    
    const setFunc = propreties.setFunc
    setFunc(value)
  }

  async function handleAddPlaylist(event) {
    console.log("Create new playlist now!")
    event.preventDefault()
    // console.log("title:", title)
    // console.log("desc:", description)

    function isValid() {
      if (title.length <= 0 || description.length <= 0 ) {
        return false
      }
      return true
    }

    const valid = isValid()
    if (valid) {   
      const body = {
        title: title,
        description: description,
      }

      const response = await axios.post(BASE_URL + `/api/playlists/`, body)
      const newPlaylist = await response.data

      setTitle('')
      setDescription('')
      console.log("A new playlist was added:", newPlaylist)

      setPlaylists((prev) => {
        return [...prev, newPlaylist]
      })
    } else {
      console.log("ERROR: Some input is invalid")
    }
  }

  return (
    <>
      <form onSubmit={(event) => handleAddPlaylist(event)}>
        {/* Input given here should just be a string */}
        <input type='text' placeholder='Playlist Title' onChange={(event) => handleInput(event, {setFunc: setTitle, input_type: "Title"})} />
        
        {/* Input given here should just be a string */}
        <input type='text' placeholder='Playlist Description' onChange={(event) => handleInput(event, {setFunc: setDescription, input_type: "Description"})} />

        <button type='submit'> Add </button>
        <button type='submit'> Cancel </button>
      </form>
    </>
  )
}

export default PlaylistForm
