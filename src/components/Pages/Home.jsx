import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Just Navigates to /hawolt cba building something Proper for now
  useEffect(() => {
    navigate("/stream/hawolt");
  }, []);

  return;
};

export default Home;
