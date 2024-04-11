import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

export const getRooms = async () => {
  const { data } = await axiosInstance.get("/");
  return data;
};

const handleError = (error) => {
  const errorMessage = error.response.data.error;
  throw new Error(errorMessage);
};

export const createRoom = async (roomDetails) => {
  try {
    const response = await axiosInstance.post("room", roomDetails);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRoomToken = async (loginDetails) => {
  try {
    const response = await axiosInstance.post("token", loginDetails);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRoom = async (roomId) => {
  try {
    const response = await axiosInstance.get(`room/${roomId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

