import { useState } from 'react'
import { Link } from 'react-router'

function SongCard(props) {
  console.log(props)
  const songObj = props.song
  const songId = songObj.id

  const title = songObj.title
  const artist = songObj.artist
  const description = songObj.description
  const duration = songObj.duration

  // Converts time in seconds into the format XX:XX:XX Hrs/Mins/Secs
  function formatDuration(time) {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    const formattedMinutes = minutes.toString().padStart(2, "0")
    const formattedSeconds = seconds.toString().padStart(2, "0")

    if (hours > 0) {
      return `${hours}:${formattedMinutes}:${formattedSeconds}`
    }
    return `${minutes}:${formattedSeconds}`
  }

  return (
    <>
      <div className='card'>
          <h3> {title} </h3>
          <p> {artist} </p>
          <p> {formatDuration(duration)} </p>
      </div>
    </>
  )
}

export default SongCard
