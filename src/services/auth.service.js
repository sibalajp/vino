// import { REACT_APP_API_BASE_URL } from '../config';

export const login = (email, password) => {
    return true;
} 

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
}