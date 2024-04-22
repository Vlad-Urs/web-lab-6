import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import bron from './assets/the_bronze.png'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <img src={bron} alt="king" />
      <h1>The Bronze Jade</h1>
    </>
  )
}

export default App
