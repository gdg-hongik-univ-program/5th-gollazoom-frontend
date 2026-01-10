import api from './axios';

interface changePassword {
    currentpassword: string;
    newpassword: string;
}


export const deleteUser = async (userId: number) => {
    const response = await api.delete(`/members/${userId}`);
    return response.data;
}

export const changePassword = async (userId: string, userPassword: changePassword) => {
  const response = await api.patch(`/members/${userId}`, userPassword);
  return response.data;
};
