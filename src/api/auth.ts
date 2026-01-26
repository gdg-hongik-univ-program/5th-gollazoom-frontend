import api from './axios';

interface UserData {
    username: string;
    password: string;
    name: string;
}

interface Credentials {
    username: string;
    password: string;
}

export const signup = async (userData: UserData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
}

export const login = async (credentials: Credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
}
