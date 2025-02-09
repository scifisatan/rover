"use client";
import React, { useState, FormEvent, ChangeEvent } from 'react';
import useImageUpload from '../hooks/useImageUpload';

const ImageUploadForm: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const { uploadedUrl, handleUpload } = useImageUpload();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      console.error("No file selected!");
      return;
    }

    await handleUpload(image);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      <button type="submit">Upload Image</button>

      {/* Display uploaded image URL */}
      {uploadedUrl && (
        <div>
          <h3>Uploaded URL:</h3>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a>
        </div>
      )}
    </form>
  );
};

export default ImageUploadForm;