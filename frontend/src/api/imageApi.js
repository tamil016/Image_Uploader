import axios from 'axios';

const API_URL = 'http://localhost:5000/api/images';

export const uploadImage = async (image, onProgress) => {
    const formData = new FormData();
    formData.append('image', image);

    const response = await axios.post(`${API_URL}/uploads`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress
    });

    return response.data;
};

export const fetchImages = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const deleteImage = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
