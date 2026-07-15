import { useState } from 'react'
import { Link } from 'react-router'

function PlaylistCard(props) {
  const playlistObj = props.list
  const playlistId = playlistObj.id
  const title = playlistObj.title
  const song_count = playlistObj.Songs?.length || 0
  //console.log(props)

  function displaySongCount(count) {
    if (count <= 0) {
      return ("No songs")
    } else {
      return (count + " song" + (count > 1 ? "s" : ""))
    }
  }

  return (
    <>
      <Link id={playlistId} to={`/playlists/${playlistId}`}>
        <div className='playlist_card'>
          <h3> {title} </h3>
          <p> {displaySongCount(song_count)} </p>
        </div>
      </Link>
    </>
  )
}

export default PlaylistCard
