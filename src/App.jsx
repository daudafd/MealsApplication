import './App.css'
import {useGlobalContext} from './context'

import Search from './components/Search'
import Meals from './components/Meals'
import Modal from './components/Modal'
import Favorites from './components/Favorites'

export default function App() {
  const {showModal, favourites} = useGlobalContext()
  return (
    <main>
      <Search /> 
      {favourites.length > 0 && <Favorites /> }  
      <Meals />
      {showModal && <Modal /> }  
      
    </main>
  )
}
