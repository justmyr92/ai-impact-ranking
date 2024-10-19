import React, { useEffect, useState } from "react";
import loginBG from "../assets/login-cover.png";
import { loginSubmit } from "../services/service";
import Swal from "sweetalert2";

const LoginPage = () => {
    const [loginCredentials, setLoginCredentials] = useState({
        email: "",
        password: "",
    });

    const [isEmpty, setIsEmpty] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (isError === true) {
            Swal.fire({
                icon: "error",
                title: "Login Error",
                text: errorMessage,
            });
            setIsError(false);
        }
    }, [isError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loginCredentials.email || !loginCredentials.password) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
            const loginResponse = await loginSubmit(loginCredentials);
            if (loginResponse.token) {
                localStorage.setItem("token", loginResponse.token);
                localStorage.setItem("role", loginResponse.role);
                localStorage.setItem("user_id", loginResponse.user_id);
                if (loginResponse.role === 0) {
                    window.location.href = "/csd/impact-ranking";
                } else {
                    window.location.href = "/sd/impact-ranking";
                }
            } else {
                setIsError(true);
                setErrorMessage(loginResponse.error);
            }
        }
    };

    return (
        <section className="h-screen">
            <div className="flex justify-center items-center h-full">
                <div className="form__container w-2/5 h-full flex items-center">
                    <form className="p-10" onSubmit={handleSubmit}>
                        <div className="form__header mb-10">
                            <h1 className="text-2xl">
                                Center for Sustainable Development Office
                            </h1>
                            <h3 className="text-xl">
                                Batangas State University - TNEU
                            </h3>
                        </div>
                        <div className="form__group flex flex-col">
                            <label
                                className="form__label mb-1 text-sm font-medium"
                                htmlFor="email_address"
                            >
                                Email Address
                            </label>
                            <input
                                className={`form__input border mb-2 mt-1 block w-full px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none ${
                                    isEmpty && loginCredentials.email === ""
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:border-blue-500"
                                }`}
                                type="text"
                                id="email_address"
                                name="email"
                                value={loginCredentials.email}
                                onChange={(e) =>
                                    setLoginCredentials({
                                        ...loginCredentials,
                                        email: e.target.value,
                                    })
                                }
                            />
                            {isEmpty && loginCredentials.email === "" ? (
                                <p className="text-red-500 text-sm">
                                    Email address is required
                                </p>
                            ) : null}
                        </div>
                        <div className="form__group mt-6">
                            <label
                                className="form__label mb-1 text-sm font-medium"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                className={`form__input border block w-full px-3 py-4 mb-1 rounded-md shadow-sm sm:text-sm focus:outline-none ${
                                    isEmpty && loginCredentials.password === ""
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:border-blue-500"
                                }`}
                                type="password"
                                id="password"
                                name="password"
                                value={loginCredentials.password}
                                onChange={(e) =>
                                    setLoginCredentials({
                                        ...loginCredentials,
                                        password: e.target.value,
                                    })
                                }
                            />
                            {isEmpty && loginCredentials.password === "" ? (
                                <p className="text-red-500 text-sm mb-1">
                                    Password is required
                                </p>
                            ) : null}

                            <p className="forgot_password underline text-red-500 text-sm cursor-pointer">
                                Forgot Password?
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 duration-300 text-white rounded-md"
                        >
                            Login
                        </button>
                    </form>
                </div>
                <div className="bg__container w-3/5 h-full">
                    <img
                        src={loginBG}
                        alt="login-bg"
                        className="h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
