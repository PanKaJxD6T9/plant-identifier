'use client'

import { useState } from 'react'
import { ImageUploader } from './components/ImageUploader'
import { PlantInfo } from './components/PlantInfo'

type PlantData = {
  rawResponse: string;
  commonName: string;
  scientificName: string;
  description: string;
  nativeRegion: string;
  growthHabits: string;
  lightRequirements: string;
  wateringNeeds: string;
  soilPreferences: string;
  temperatureRange: string;
  commonUses: string;
  notableFeatures: string;
}

export default function Home() {
  const [plantData, setPlantData] = useState<PlantData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (imageFile: File) => {
    setIsLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const response = await fetch('/api/identify-plant', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to identify plant')
      }

      const data: PlantData = await response.json()
      setPlantData(data)
    } catch (err) {
      console.error('Error identifying plant:', err)
      setError('Failed to identify plant. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800">Plant Identifier</h1>
        <ImageUploader onUpload={handleImageUpload} />
        {isLoading && (
          <div className="text-center mt-8">
            <p className="text-lg font-semibold text-green-700">Identifying plant...</p>
          </div>
        )}
        {error && (
          <div className="text-center mt-8">
            <p className="text-lg font-semibold text-red-600">{error}</p>
          </div>
        )}
        {plantData && <PlantInfo plantData={plantData} />}
      </div>
    </main>
  )
}

