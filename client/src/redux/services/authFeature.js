import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

 axios.defaults.withCredentials = true;
export const AUTH_URL =  `${BACKEND_URL}/users/`

const register = async (userData) => {
    const response = await axios.post(AUTH_URL + "register", userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(AUTH_URL + "login", userData);
    return response.data;
};
const logOut = async () => {
    const response = await axios.get(AUTH_URL + "logOut");
    return response.data.message;
};
const getLogInStatus = async () => {
    const response = await axios.get(AUTH_URL + "loggedin");
    return response.data;
};
const getuserProfile = async () => {
    const response = await axios.get(AUTH_URL + "getuser");
    return response.data;
};
const loginUserAsSeller = async (userData) => {
    const response = await axios.post(AUTH_URL + "seller", userData, {
        withCredentials: true,
    });
    return response.data;
};
const getUserIncome = async () => {
    const response = await axios.get(AUTH_URL + "sell-amount");
    return response.data;
};

//zuwhun Admin
const getSingleUser = async (userId) => {
  const response = await axios.get(`${BACKEND_URL}/users/${userId}`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return response.data;
};

const updateBalance = async ({ userId, newBalance }) => {
  const response = await axios.patch(
    `${BACKEND_URL}/users/${userId}/update-balance`,
    { newBalance },
    {
      withCredentials: true,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }
  );
  return response.data;
};
const getIncome = async () => {
    const response = await axios.get(AUTH_URL + "estimate-income");
    return response.data;
};
const getAllUser = async () => {
    const response = await axios.get(AUTH_URL + "users");
    return response.data;
};

const authService = {
    register,
    login,
    logOut,
    getLogInStatus,
    getuserProfile,
    loginUserAsSeller,
    getUserIncome,
    getIncome,
    getAllUser,
    getSingleUser,
    updateBalance,
};

export default authService;