import axios from "axios";
import { Bounce, toast } from "react-toastify";

export async function updateGameHistory({ duration, highestTileScore, moves }) {
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/scores/`,
      { duration, highestTileScore, moves },
      { withCredentials: true },
    );
  } catch (error) {
    toast.info(error.response?.data?.message ?? error.message, {
      position: "bottom-right",
      autoClose: 2000,
      theme: "light",
      transition: Bounce,
    });
  }
}
