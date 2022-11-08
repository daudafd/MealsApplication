  import React, {useContext, useEffect, useState} from 'react'

const AppContext = React.createContext()

import axios from 'axios'
const allMealsUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
const randomMealUrl = 'https://www.themealdb.com/api/json/v1/1/random.php'

const getFavouritesFromLocalStorage = () => {
  let favorites = localStorage.getItem('favorites');

  if(favorites){
    favorites = JSON.parse(localStorage.getItem('favorites'))
  }
  else {
    favorites = []
  }
  return favorites
}

const AppProvider = ({ children }) => {

    //   const fetchData = async () => {
    //   try {
    //     const response = await fetch('https://randomuser.me/api/')
    //     const data = await response.json()
    //     console.log(data)
    //   }
    //   catch (error) {
    //     console.log(error)
    //   }
    // }

    const [loading, setLoading] = useState(false)
    const [meals, setMeals] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
  
    const [showModal, setShowModal] = useState(false)
    const [selectedMeal, setSelectedMeal] = useState(null)
    const [favourites, setFavourites] = useState(getFavouritesFromLocalStorage)
  
    const fetchMeals = async (allMealsUrl) => {
      setLoading(true)
      try {
        const { data } = await axios(allMealsUrl)
        
        if (data.meals) {
          setMeals(data.meals) 
        }
        else {
          setMeals([])
        }
      }
      catch (error) {
        console.log(error.response)
      }
      setLoading(false)
    }

  const fetchRandomMeal = () => {
    fetchMeals(randomMealUrl)
  }

  const selectMeal = (idMeal, favouriteMeal) => {
    
    let meal;
    if(favouriteMeal) {
      meal = favourites.find((meal)=>meal.idMeal === idMeal)
    }
    else {
      meal = meals.find((meal)=>meal.idMeal === idMeal)
    }
    
    setSelectedMeal(meal)
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const addToFavourites = (idMeal) => {

    const meal = meals.find((meal) => meal.idMeal === idMeal)
    const alreadyFavourite = favourites.find((meal) => meal.idMeal === idMeal)
    if(alreadyFavourite) return
    const updatedFavourites = [...favourites, meal];
    setFavourites(updatedFavourites)
    localStorage.setItem('favorites', JSON.stringify(updatedFavourites))
  }

  const removeFromFavourites = ( idMeal ) => {
    const updatedFavourites = favourites.filter((meal) => meal.idMeal != idMeal)
    setFavourites(updatedFavourites)
    localStorage.setItem('favorites', JSON.stringify(updatedFavourites))
  }

    useEffect(()=>{
    // fetchData()
    fetchMeals(allMealsUrl)
    
  },[])
  
  useEffect(()=>{
    if(!searchTerm) return
    fetchMeals(`${allMealsUrl}${searchTerm}`)
    
  },[searchTerm])
  
  return <AppContext.Provider value={{loading, meals, setSearchTerm, fetchRandomMeal, showModal, selectedMeal, selectMeal, closeModal, addToFavourites, removeFromFavourites, favourites}}>
    {children}
  </AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}


export { AppContext, AppProvider }