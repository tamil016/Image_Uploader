import React, { useState } from 'react';
import '../css/ProfileCard.css';
import Tamil from '../assets/Tamil.jpeg'
import Mern from '../assets/MERN.jpeg';
import ImageUploader from './ImageUploader';

const ProfileCard: React.FC = () => {
    const [isUploaderVisible, setIsUploaderVisible] = useState(false);
    const [profileImage, setProfileImage] = useState<string>(Tamil);

    const popUpHandler = () => {
        setIsUploaderVisible(!isUploaderVisible);
    };

    const handleImageSelect = (image: { url: string }) => {
        setProfileImage(image.url);
        setIsUploaderVisible(false);
    };

    return (
        <div className="profile-card">
            <div className="header">    
                <img src={Mern} alt="Background" className="background-image" />
            </div>
            <div className="profile-info">
                <img src={profileImage} alt="Profile" className="profile-image" />
                <div className='button-pic'>
                    <button className="updated-button" onClick={popUpHandler}>Update picture</button>
                </div>
                <div className="profile-details">
                    <h2>Jack Smith</h2>
                    <p>@kingjack &bull; Senior Product Designer at <span className="webflow">Webflow</span> &bull; He/Him</p>
                </div>
            </div>
            {isUploaderVisible && <ImageUploader trigger={true} onClose={popUpHandler} onImageSelect={handleImageSelect} />}
        </div>
    );
};

export default ProfileCard;