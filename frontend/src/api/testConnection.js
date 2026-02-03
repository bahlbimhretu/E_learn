import axios from "axios";

export const testConnection = async () => {
  try {
    const res = await axios.get("http://localhost:5000/");
    console.log("Backend Connected:", res.data);
  } catch (err) {
    console.error("Connection Failed:", err.message);
  }
};
