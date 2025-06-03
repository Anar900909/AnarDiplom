import axios from "axios";
import { BIDDING_URL } from "../../utils/url";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

const placebid = async ({ price, productId }) => {
  const response = await axios.post(
    `${BIDDING_URL}`,
    { price, productId },
    getAuthHeader()
  );
  return response.data;
};

const validateBid = async ({ productId, price }) => {
  const response = await axios.post(
    `${BIDDING_URL}/validate`,
    { productId, price },
    getAuthHeader()
  );
  return response.data;
};

const fetchBiddingHistory = async (productId) => {
  try {
    const response = await axios.get(
      `${BIDDING_URL}/history/${productId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Bidding history error:', error.response?.data || error.message);
    return [];
  }
};

const sellproductsbyuser = async (productId) => {
  const response = await axios.post(
    `${BIDDING_URL}/sell`,
    { productId },
    getAuthHeader()
  );
  return response.data;
};

const biddingService = {
  placebid,
  validateBid,
  fetchBiddingHistory,
  sellproductsbyuser
};

export default biddingService;