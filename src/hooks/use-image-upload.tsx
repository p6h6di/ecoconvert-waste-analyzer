"use client";

import { useCallback, useRef, useState } from "react";

interface UseImageUploadProps {
  onUpload?: (url: string, imageElement?: HTMLImageElement) => void;
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );

  const convertBase64ToImage = useCallback(
    (base64String: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          resolve(img);
        };

        img.onerror = (error) => {
          reject(error);
        };

        img.src = base64String;
      });
    },
    []
  );

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);

        // Convert file to Base64
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target?.result as string;
          setPreviewUrl(base64String);

          try {
            // Convert Base64 to HTMLImageElement
            const imgElement = await convertBase64ToImage(base64String);
            setImageElement(imgElement);

            // Pass both the Base64 string and HTMLImageElement to onUpload callback
            onUpload?.(base64String, imgElement);
          } catch (error) {
            console.error("Error converting Base64 to Image:", error);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onUpload, convertBase64ToImage]
  );

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    setFileName(null);
    setImageElement(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    imageElement,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  };
}
