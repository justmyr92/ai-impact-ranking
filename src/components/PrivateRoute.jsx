import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoute = ({ Component, Path }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false); // Stop loading when no token
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:9000/api/validate-token",
                    {
                        method: "POST",
                        headers: { jwt_token: token },
                    }
                );

                const data = await response.json();
                setIsAuthenticated(data === true);
            } catch (error) {
                console.error(error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false); // Stop loading after checking authentication
            }
        };

        checkAuthentication();
    }, [isAuthenticated]);

    if (isLoading) return null; // Render nothing while loading

    return isAuthenticated ? <Component /> : <Navigate to={Path || "/login"} />;
};

export default PrivateRoute;
