import { createContext, useContext, useState } from 'react'

const PhotoContext = createContext()

export function PhotoProvider({ children }) {
  const [selectedPhotos, setSelectedPhotos] = useState([])

  const resetPhotos = () => {
    setSelectedPhotos([])
  }

  return (
    <PhotoContext.Provider value={{ selectedPhotos, setSelectedPhotos, resetPhotos }}>
      {children}
    </PhotoContext.Provider>
  )
}

export function usePhoto() {
  return useContext(PhotoContext)
}
