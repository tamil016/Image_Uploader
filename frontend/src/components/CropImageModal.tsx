import React, { useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import '../css/CropImageModal.css';

interface CropImageModalProps {
    image: { _id: string; url: string };
    onCrop: (croppedImage: { id: string; url: string }) => void;
    onClose: () => void;
}

const CropImageModal: React.FC<CropImageModalProps> = ({ image, onCrop, onClose }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCrop = async () => {
        if (!croppedAreaPixels) {
            console.error('Cropped area pixels are not defined');
            return;
        }

        try {
            const croppedImageUrl = await getCroppedImg(image.url, croppedAreaPixels);
            onCrop({ id: image._id, url: croppedImageUrl });
            onClose();
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    };

    return (
        <div className="main-crop">
            <div className="crop-modal">
                <div className='pic-mark'>
                    <h2>Crop your Picture</h2>
                    <div><i className="fa-solid fa-xmark" onClick={onClose}></i></div>
                </div>
                <div className="crop-container">
                    <Cropper
                        image={image.url}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="crop-actions">
                    <button className='cancel' onClick={onClose}>Cancel</button>
                    <button onClick={handleCrop}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default CropImageModal;
