import { useState } from 'react';
import { uploadImage, deleteImage } from '../api/imageApi';

export const useImageUpload = (images, setImages, setIsCropping, setImageToCrop) => {
    const [uploadProgress, setUploadProgress] = useState(null);
    const [error, setError] = useState(null);

    const handleDrop = async (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);

        if (files.length + images.length > 5) {
            setError('You have reached the image limit.');
            return;
        }

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Unsupported file format.');
                continue;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('File size limit exceeded.');
                continue;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                const newImage = {
                    id: Date.now(),
                    url: reader.result,
                    isUploading: true,
                    progress: 0
                };
                setImages((prevImages) => [...prevImages, newImage]);

                try {
                    await handleUpload(newImage);
                } catch (err) {
                    setError('Upload failed.');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (image) => {
        setUploadProgress(0);
        try {
            const response = await uploadImage(image.url, (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(progress);
                setImages((prevImages) =>
                    prevImages.map((img) => (img.id === image.id ? { ...img, progress } : img))
                );
            });
            setImages((prevImages) =>
                prevImages.map((img) =>
                    img.id === image.id ? { ...img, url: response.data.url, isUploading: false } : img
                )
            );
            setUploadProgress(null);
        } catch (error) {
            setError('Network error.');
            setUploadProgress(null);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteImage(id);
            setImages((prevImages) => prevImages.filter((image) => image.id !== id));
        } catch (error) {
            setError('Server error.');
        }
    };

    const handleSelectProfile = (id) => {
        setImages((prevImages) =>
            prevImages.map((image) =>
                image.id === id ? { ...image, isProfile: true } : { ...image, isProfile: false }
            )
        );
    };

    const handleCropImage = (croppedImage) => {
        setImages((prevImages) =>
            prevImages.map((image) => (image.id === croppedImage.id ? croppedImage : image))
        );
        setIsCropping(false);
    };

    return {
        handleDrop,
        handleDelete,
        handleUpload,
        handleSelectProfile,
        handleCropImage,
        uploadProgress,
        error
    };
};
