import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { uploadImage, fetchImages, deleteImage } from '../api/imageApi';
import CropImageModal from './CropImageModal';
import ProgressBar from './ProgressBar';
import '../css/ImageUploader.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ImageUploader = ({ trigger, onClose, onImageSelect }) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const getImages = async () => {
            try {
                const fetchedImages = await fetchImages();
                setImages(fetchedImages);
            } catch (error) {
                setError('Error fetching images');
            }
        };

        getImages();
    }, []);

    const handleDrop = (acceptedFiles) => {
        if (images.length + acceptedFiles.length > 5) {
            setError('You have reached the image limit.');
            return;
        }

        acceptedFiles.forEach(async (file) => {
            if (file.size > MAX_FILE_SIZE) {
                setError('File size exceeds 5 MB limit.');
                return;
            }

            setUploading(true);
            setUploadProgress(0);

            try {
                const data = await uploadImage(file, (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                });

                setImages([...images, data]);
                setError(null);
            } catch (error) {
                setError('Error uploading image');
            } finally {
                setUploading(false);
                setUploadProgress(null);
            }
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteImage(id);
            setImages(images.filter((image) => image._id !== id));
            setError(null);
        } catch (error) {
            setError('Error deleting image');
        }
    };

    const handleCrop = (croppedImage) => {
        setImages(images.map((img) =>
            img._id === croppedImage.id ? { ...img, url: croppedImage.url } : img
        ));
        setIsCropping(false);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/jpeg, image/png',
        onDropRejected: () => {
            setError('Unsupported file type. Please upload an image.');
        }
    });

    const handleImageSelectClick = () => {
        if (selectedImage) {
            onImageSelect(selectedImage);
        }
    };

    return trigger ? (
        <div className="main-container">
            <div className="image-uploader-container">
                <div className="top">
                    <div className='upload'>
                        <h3>Upload images(s)</h3>
                        <p>You may upload up to 5 images</p>
                    </div>
                    <div>
                        <i className="fa-solid fa-xmark" onClick={onClose}></i>
                    </div>
                </div>
                <div {...getRootProps()} className="drag-drop-container">
                    <input {...getInputProps()} />
                    {uploading && <p>Uploading...</p>}
                    {uploadProgress !== null && <ProgressBar progress={uploadProgress} />}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!error && <div className='cloud'><i className="fa-solid fa-cloud-arrow-up fa-2x"></i></div>}
                    <div className="container-p">
                        <p className='container-p1'>Click or drag and drop to upload</p>
                        <p className='png'>PNG, or JPG (Max 5MB)</p>
                    </div>
                </div>

                <div className="images-list">
                    {images.map((image) => (
                        <div key={image._id} className="image-item">
                            <div className="image-info">
                                <div>
                                    <img src={image.url} alt={image.filename} width="100" />
                                </div>
                                <div className='files'>
                                    <div>
                                        <p className='filename'>{image.filename}</p>
                                        <p className='size'>{(image.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <div className="image-actions">
                                        <p className='crop' onClick={() => { setImageToCrop(image); setIsCropping(true); }}><i className="fa-solid fa-crop-simple"></i> Crop image</p>
                                        <p className='delete' onClick={() => handleDelete(image._id)}><i className="fa-solid fa-trash-arrow-up"></i> Delete</p>
                                    </div>
                                </div>
                            </div>
                            <div className='radio'>
                                <input
                                    type="radio"
                                    name="selectedImage"
                                    checked={selectedImage && selectedImage._id === image._id}
                                    onChange={() => setSelectedImage(image)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {isCropping && <CropImageModal image={imageToCrop} onCrop={handleCrop} onClose={() => setIsCropping(false)} />}

                <div className="actions">
                    <button className='cancel' onClick={onClose}>Cancel</button>
                    <button className='select' onClick={handleImageSelectClick}>Select image</button>
                </div>
            </div>
        </div>
    ) : <h2>Loading...</h2>
};

ImageUploader.propTypes = {
    trigger: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onImageSelect: PropTypes.func.isRequired,
};

export default ImageUploader;
