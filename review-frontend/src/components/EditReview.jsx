import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ReviewForm from "./ReviewForm";
import { AuthContext } from "./context/AuthProvider";

const EditReview = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [reviewData, setReviewData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/review/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setReviewData({
            comment: data.review.comment,
            type: data.review.type,
            rate: data.review.rating.toString(),
            restaurant: data.review.restaurant,
          });
        } else {
          console.error("Failed to fetch review");
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching review:", err);
        navigate("/");
      }
    };

    fetchReview();
  }, [id, token, navigate]);

  const handleUpdate = async (updatedData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/review/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      console.log("Updating with data:", updatedData);

      if (res.ok) {
        navigate("/");
      } else {
        const errorText = await res.text();
        console.error("Update failed:", errorText);
        alert("Failed to update review.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong.");
    }
  };

  return reviewData ? (
    <ReviewForm onSubmit={handleUpdate} initialData={reviewData} />
  ) : (
    <p>Loading review...</p>
  );
};

export default EditReview;
