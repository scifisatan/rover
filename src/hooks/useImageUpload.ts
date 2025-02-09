import { useState } from 'react';
import { createClient } from '../utils/supabase/client';

const supabase=createClient();
const useImageUpload = () => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`images/${fileName}`, file);

      if (error || !data) {
        console.error('Error uploading image:', error);
        return null;
      }

      const { publicUrl } = supabase.storage.from('images').getPublicUrl(data.path).data;
      return publicUrl;
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  };

  const handleUpload = async (file: File) => {
    const url = await uploadImage(file);
    setUploadedUrl(url);
    return url;
  };

  return { uploadedUrl, handleUpload };
};

export default useImageUpload;