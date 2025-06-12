import { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest } from '../services/auth.service';
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth require an AuthProvider");
    }

    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signin = async (credentials) => {
        try {
            const res = await loginRequest(credentials.email, credentials.password);

            const role = res.data.role;

            if (role == 'admin') {
                setIsAdmin(true);
            }

            setIsAuthenticated(true);

            setUser({
                id: res.data.id,
                email: res.data.email,
                role
            });

            Cookies.set("token", res.data.accessToken, { expires: 1 });

        } catch (error) {
            if (error.response && error.response.data) {
                if (Array.isArray(error.response.data)) {
                    setErrors(error.response.data);
                } else if (error.response.data.message) {
                    setErrors([error.response.data.message]);
                } else {
                    setErrors(["Unhandled error."]);
                }
            } else {
                setErrors(["Error on server connection."]);
            }
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    useEffect(() => {
        async function checkLogin() {
            const token = Cookies.get("token");

            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                setUser(null);
                return;
            }

            try {
                setIsAuthenticated(true);
                const storedUserEmail = Cookies.get("user_email");
                const storedUserId = Cookies.get("user_id");
                const storedUserRole = Cookies.get("user_role");

                if (storedUserEmail && storedUserId && storedUserRole) {
                    setUser({
                        id: parseInt(storedUserId, 10),
                        email: storedUserEmail,
                        role: storedUserRole
                    });
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    Cookies.remove("token");
                }

                setLoading(false);

            } catch (error) {

                console.error("Error durante la verificación inicial del token:", error);
                setIsAuthenticated(false);
                setUser(null);
                Cookies.remove("token");
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{
            signin,
            loading,
            logout,
            user,
            isAuthenticated,
            isAdmin,
            errors
        }}>{children}
        </AuthContext.Provider>
    )
}