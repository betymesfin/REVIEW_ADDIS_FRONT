import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate } from "react-router-dom";
import "./Reviewform.css";

function ReviewForm({ onSubmit, initialData = {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { restaurantId } = location.state || {};
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const [formData, setFormData] = useState({
    comment: initialData.comment || "",
    type: initialData.type || "",
    rate: initialData.rate || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const restaurantToUse = restaurantId || initialData.restaurant;

    if (!restaurantToUse) {
      alert("Didn't get the restaurantId.");
      return;
    }

    if (!formData.comment.trim()) {
      alert("Please provide a comment for the review.");
      return;
    }
    if (!formData.type.trim()) {
      alert("Please provide type.");
      return;
    }
    if (!formData.rate.trim()) {
      alert("Please select a rate value.");
      return;
    }

    await onSubmit({
      ...formData,
      restaurant: restaurantToUse,
    });
    navigate("/");
  };
  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="discussion-container">
      <Form onSubmit={handleSubmit} className="discussion-form">
        <Form.Group className="form-group row">
          <Form.Label htmlFor="comment" className="col-12 col-md-4 form-label">
            Comment
          </Form.Label>
          <div className="col-12 col-md-8">
            <Form.Control
              as="textarea"
              rows={4}
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Write your comment..."
              className="form-control"
              ref={inputRef}
            />
          </div>
        </Form.Group>
        <Form.Group className="form-group row">
          <Form.Label htmlFor="type" className="col-12 col-md-4 form-label">
            Type
          </Form.Label>
          <div className="col-12 col-md-8">
            <Form.Select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="custom-select"
            >
              <option value="">Select Type</option>
              <option value="dine-in">Dine-in</option>
              <option value="delivery">Delivery</option>
              <option value="takeaway">Takeaway</option>
              <option value="other">Other</option>
            </Form.Select>
          </div>
        </Form.Group>

        <Form.Group className="form-group row">
          <Form.Label htmlFor="rate" className="col-12 col-md-4 form-label">
            Rate
          </Form.Label>
          <div className="col-12 col-md-8">
            <Form.Select
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="custom-select"
            >
              <option value="">Select rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </Form.Select>
          </div>
        </Form.Group>
        <div className="buttons-container text-center">
          <button className="create-discussions-btn">Submit</button>
          <button
            className="create-discussions-btn"
            type="button"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </Form>
    </div>
  );
}

export default ReviewForm;
