import React from 'react'
import { Loader } from '@react-three/drei'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <h2 className="text-2xl font-bold text-white">Loading Portfolio...</h2>
      </div>
      <Loader />
    </div>
  )
}

export default LoadingScreen
