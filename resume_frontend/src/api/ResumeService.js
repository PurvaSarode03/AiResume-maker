import axios from "axios";

export const baseURL = import.meta.env.VITE_APP_API_URL;

export const axiosInstance = axios.create({
    baseURL: baseURL,
});

export const generateResume = async (description) => {
    const response = await axiosInstance.post("/api/v1/resume/generate", {
        userDescription: description,
    });
    return response.data;
};