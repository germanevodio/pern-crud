import axios from "axios";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';

const http = axios.create({
    baseURL: "http://localhost:5000/api/v1"
});

http.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");

        if (token) {
            config.headers.Authorization = `${token}`;
        }

        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;

        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.message || "Unhandled error";

            switch (status) {
                case 401:
                    Swal.fire({
                        icon: 'error',
                        title: 'Unauthorized',
                        text: message,
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        Cookies.remove("token");
                        Cookies.remove("user_id");
                        Cookies.remove("user_email");
                        Cookies.remove("user_role");
                    });
                    break;
                case 403:
                    Swal.fire({
                        icon: 'warning',
                        title: 'Denied access',
                        text: message,
                        confirmButtonText: 'Ok'
                    });
                    break;
                case 404:
                    Swal.fire({
                        icon: 'info',
                        title: 'Not found',
                        text: message,
                        confirmButtonText: 'Ok'
                    });
                    break;
                case 500:
                    Swal.fire({
                        icon: 'error',
                        title: 'Internal Server Error',
                        text: message,
                        confirmButtonText: 'Ok'
                    });
                    break;
                default:
                    Swal.fire({
                        icon: 'error',
                        title: `Error ${status}`,
                        text: message,
                        confirmButtonText: 'Ok'
                    });
                    break;
            }
        } else if (error.request) {
            Swal.fire({
                icon: 'error',
                title: 'Network error',
                text: 'Verify your connection.',
                confirmButtonText: 'Ok'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Unhandled error',
                text: error.message || 'Unhandled error',
                confirmButtonText: 'Ok'
            });
        }

        return Promise.reject(error);
    }
);

const getAll = (page = 1, limit = 10, role = "", userStatus = "", search = "") => {
    let params = new URLSearchParams();
    params.append("page", page);
    params.append("size", limit);

    if (role) {
        params.append("role", role);
    }

    if (userStatus) {
        params.append("status", userStatus);
    }

    if (search) {
        params.append("search", search);
    }

    return http.get(`/users?${params.toString()}`);
};

const get = (id) => {
    return http.get(`/users/${id}`);
};

const create = (data) => {
    return http.post("/users", data);
};

const update = (id, data) => {
    return http.put(`/users/${id}`, data);
};

const remove = (id) => {
    return http.delete(`/users/${id}`);
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
};