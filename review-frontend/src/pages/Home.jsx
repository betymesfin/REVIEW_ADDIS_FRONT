import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/restaurant`);
        const data = await res.json();
        setRestaurants(data);
        console.log(data);
        // console.log("Type of data:", typeof data);
        // console.log("Is Array?", Array.isArray(data));
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      }
    };

    getRestaurants();
  }, []);

  return (
    <div>
      <h2>Restaurants</h2>
      <RestaurantCard key={restaurants._id} restaurant={restaurants} />
    </div>
  );
};

export default Home;
