const URL = "http://localhost:9000";

export const loginSubmit = async (loginCredentials) => {
    try {
        // First, try to log in with CSD
        let csdResponse = await fetch(`${URL}/api/csd-office/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginCredentials),
        });

        let csdResponseData = await csdResponse.json();

        // Check if the CSD login response is successful
        if (csdResponse.ok) {
            // Handle successful CSD login response

            return {
                token: csdResponseData.token,
                role: 0,
                user_id: csdResponseData.user_id,
            };
        } else {
            // If CSD login fails, try the SD login
            let sdResponse = await fetch(`${URL}/api/sd-office/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginCredentials),
            });
            let sdResponseData = await sdResponse.json();
            console.log(sdResponseData.token, 1, sdResponseData.user_id);

            if (sdResponse.ok) {
                // Handle successful SD login response
                console.log(sdResponseData.token, 1, sdResponseData.user_id);
                return {
                    token: sdResponseData.token,
                    role: 1,
                    user_id: sdResponseData.user_id,
                };
            } else {
                return {
                    error: "Incorrect email or password!",
                };
            }
        }
    } catch (error) {
        console.error("Error during login:", error);
        return {
            error: "An error occurred during login.",
        };
    }
};

export const validateToken = async () => {
    try {
        const token = localStorage.getItem("token");

        if (token) {
            const response = await fetch(`${URL}/api/validate-token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    jwt_token: token,
                },
            });
            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                return {
                    error: "Invalid token",
                };
            }
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error during token validation:", error);
        return {
            error: "An error occurred during token validation.",
        };
    }
};

//get all sd offices
export const getAllSdOffices = async () => {
    try {
        const response = await fetch(`${URL}/api/get/sd-office/with-campuses`);
        const data = response.json();
        return data;
    } catch (error) {
        console.error("Error during fetching sd offices:", error);
        return {
            error: "An error occurred during fetching sd offices.",
        };
    }
};

export const getCampusesByExtension = async (is_extension) => {
    try {
        const response = await fetch(`${URL}/api/get/campuses/${is_extension}`);
        const data = response.json();
        return data;
    } catch (error) {
        console.error("Error during fetching campuses:", error);
        return {
            error: "An error occurred during fetching campuses.",
        };
    }
};

export const addSDOffice = async (sdCredentials) => {
    try {
        const response = await fetch(`${URL}/api/add/sd-office`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sdCredentials),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during adding sd office:", error);
        return {
            error: "An error occurred during adding sd office.",
        };
    }
};

export const getInstruments = async () => {
    try {
        const response = await fetch(
            `${URL}/api/get/instrumentsbysdgandsection`
        );
        const data = response.json();
        return data;
    } catch (error) {
        console.error("Error getting instruments:", error);
    }
};
