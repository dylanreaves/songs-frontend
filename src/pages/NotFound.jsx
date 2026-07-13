import { useState } from 'react'
import { Link } from 'react-router'

function NotFound() {
  console.log("Page not found.")
  
  return (
    <>
      <div>
        <p> Page not Found </p>
        <Link to="/"> Back to Home </Link>
      </div>
    </>
  )
}

export default NotFound
