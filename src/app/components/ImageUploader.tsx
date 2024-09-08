import { useState, ChangeEvent } from 'react'

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
        onUpload(file)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <label className="block mb-4">
        <span className="text-gray-700">Upload a plant image:</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100"
        />
      </label>
      {previewUrl && (
        <div className="mt-4">
          <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg" />
        </div>
      )}
    </div>
  )
}