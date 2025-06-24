import "./Restaurant.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthProvider";

const RestaurantCard = ({ restaurant }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const currentRestaurant = restaurant[currentIndex];
  const images = currentRestaurant?.images || [];
  const { token } = useContext(AuthContext);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!currentRestaurant?._id) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/review/restaurant/${
            currentRestaurant._id
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setReviews(data.review);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [currentRestaurant?._id]);

  const handleNextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextRestaurant = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, restaurant.length - 1));
    setImageIndex(0);
  };

  const handlePrevRestaurant = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setImageIndex(0);
  };

  const handleRate = () => {
    if (!currentRestaurant || !currentRestaurant._id) {
      alert("Restaurant ID is missing!");
      return;
    }
    navigate("/create-review", {
      state: { restaurantId: currentRestaurant._id },
    });
  };

  const handleEdit = (reviewId) => {
    navigate(`/edit-review/${reviewId}`);
  };

  const handleDelete = async (reviewId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/review/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        alert("Review deleted successfully!");
      } else {
        const error = await res.text(); 
        console.error("Failed to delete review:", error);
        alert("Failed to delete review.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("An error occurred while deleting the review.");
    }
  };

  return (
    <>
      <div className="slider-container">
        <button className="arrow left" onClick={handlePrevRestaurant}>
          ‹
        </button>

        <div className="card">
          <div className="image-carousel">
            {images.length > 0 && (
              <img
                src={images[imageIndex]}
                alt="restaurant"
                className="carousel-img"
              />
            )}
            <button className="img-arrow left" onClick={handlePrevImage}>
              ‹
            </button>
            <button className="img-arrow right" onClick={handleNextImage}>
              ›
            </button>
          </div>

          <h2>{currentRestaurant?.name}</h2>
          <p>{currentRestaurant?.description}</p>
          <p>Location: {currentRestaurant?.location}</p>
          <p>Rating: {currentRestaurant?.averageRating}</p>

          <div className="buttons-container">
            <button onClick={handleRate} className="create-rate-btn">
              Rate
            </button>
          </div>
        </div>

        <button className="arrow right" onClick={handleNextRestaurant}>
          ›
        </button>
      </div>
      <div className="comments-container">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => {
            console.log("Logged in user ID:", currentUserId);
            console.log("Review createdBy ID:", review.createdBy?._id);

            return (
              <div key={review._id} className="review-item">
                <p>
                  <strong>
                    {review.createdBy?.name || "Anonymous"} ({review.type})
                  </strong>
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p>{review.comment}</p>
                <p>Rating: {review.rating}</p>

                {String(review.createdBy?._id) === String(currentUserId) && (
                  <div className="review-buttons">
                    <button onClick={() => handleEdit(review._id)}>Edit</button>
                    <button onClick={() => handleDelete(review._id)}>
                      Delete
                    </button>
                  </div>
                )}
                <hr />
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default RestaurantCard;
