import { useState, useCallback, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('property-favorites')
    if (savedFavorites) {
      try {
        const favoritesArray = JSON.parse(savedFavorites)
        setFavorites(new Set(favoritesArray))
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('property-favorites', JSON.stringify([...favorites]))
  }, [favorites])

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId)
      } else {
        newFavorites.add(propertyId)
      }
      return newFavorites
    })
  }, [])

  const isFavorited = useCallback((propertyId: string) => {
    return favorites.has(propertyId)
  }, [favorites])

  const addFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => new Set([...prev, propertyId]))
  }, [])

  const removeFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      newFavorites.delete(propertyId)
      return newFavorites
    })
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites(new Set())
  }, [])

  return {
    favorites,
    toggleFavorite,
    isFavorited,
    addFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.size
  }
}
