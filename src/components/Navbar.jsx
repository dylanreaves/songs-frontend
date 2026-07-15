import { useState } from 'react'
import { Link } from 'react-router'

function NavBar() {

  return (
    <>
      <nav>
        <Link to='/'> 
          <h1> Home </h1>
        </Link>
      </nav>
    </>
  )
}

export default NavBar
