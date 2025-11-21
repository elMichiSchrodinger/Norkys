import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Productos from './pages/productos'
import Busqueda from './pages/busqueda'

function App() {
  

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/menu' element={<Productos/>}/>
      <Route path='/busqueda/:query' element={<Busqueda/>}/>
    </Routes>
  )
}

export default App
