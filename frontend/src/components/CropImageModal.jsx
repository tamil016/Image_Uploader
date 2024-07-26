import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import '../css/CropImageModal.css';

const CropImageModal = ({ image, onCrop, onClose }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCrop = async () => {
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
                <h2>Crop your Picture</h2>
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

CropImageModal.propTypes = {
    image: PropTypes.object.isRequired,
    onCrop: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CropImageModal;

