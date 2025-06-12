import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5000/api/v1/auth",
    headers: {
        "Content-Type": "application/json",
    },
});

export const loginRequest = (email, password) => {
    return http.post('/login', { email, password });
};