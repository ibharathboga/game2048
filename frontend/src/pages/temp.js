import { useEffect } from "react";
import axios from "axios";
import "../styles/temp.css";

function TempoPage() {
  const handleClick = async () => {
    console.log("handleClick:invoked");
    console.log(process.env.REACT_APP_API_URL);

    try {
      const response = await axios.get(process.env.REACT_APP_API_URL);
      console.log(response.data);
    } catch (error) {
      console.log("handleClick:error");
      console.log(error);
    }
  };

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <div className="temp-page">
      <h1>temp page</h1>
      <button onClick={handleClick}>update</button>
    </div>
  );
}

export default TempoPage;
