import axios, { AxiosProgressEvent } from 'axios';

const API_URL = 'https://image-uploader-bdp9.onrender.com/api/images';

interface Image {
    _id: string;
    url: string;
    filename: string;
    size: number;
}

export const uploadImage = async (image: File, onProgress: (progressEvent: AxiosProgressEvent) => void): Promise<Image> => {

    const formData = new FormData();
    formData.append('image', image);

    const response = await axios.post(`${API_URL}/uploads`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress
    });

    return response.data;
};

export const fetchImages = async (): Promise<Image[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const deleteImage = async (id: string): Promise<Image> => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
