
import React, { useCallback, useState } from 'react';
import { useModelStore } from '../store/useModelStore';
import { UploadCloud, XCircle } from 'lucide-react';

export default function ImageUploader() {
  const selectedModel = useModelStore((state) =>
    state.selectedModelId === null ? null : state.models.find(m => m.id === state.selectedModelId) || null
  );
  const addImages = useModelStore((state) => state.addImages);
  const removeImage = useModelStore((state) => state.removeImage);

  // Si no hay modelo seleccionado, mostrar mensaje
  if (!selectedModel) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Selecciona un modelo para subir imágenes</p>
      </div>
    );
  }

  const { images } = selectedModel;
  const [isDragging, setIsDragging] = useState(false);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const dataUrls = await Promise.all(imageFiles.map(fileToDataUrl));
    addImages(dataUrls);
  }, [addImages]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };


  return (
    <div className="space-y-4">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
            <UploadCloud className="h-12 w-12" />
            <p className="font-semibold">Arrastra y suelta imágenes aquí</p>
            <p className="text-sm">o</p>
            <label htmlFor="file-upload" className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500">
                <span>Selecciona archivos</span>
                <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={onFileSelect} accept="image/*" />
            </label>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((imgSrc, index) => (
            <div key={index} className="relative group">
              <img src={imgSrc} alt={`Preview ${index}`} className="w-full h-auto object-cover rounded-lg shadow-md" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
