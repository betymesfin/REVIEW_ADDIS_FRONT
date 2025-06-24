import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ReviewForm from "./components/ReviewForm";
import EditReview from "./components/EditReview.jsx";
// import Dashboard from "./pages/Dashboard";
import Login from "./components/UserLogin/Login.jsx";
import Logout from "./components/UserLogout/Logout.jsx";
import Signup from "./components/userSignup/Signup.jsx";
import AuthProvider from "./components/context/AuthProvider.jsx";

function App() {
  async function addReview(newReview) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Failed to add a review. Please log in to continue.");
      return;
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newReview),
    };

    const url = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${url}/review`, options);

      if (!response.ok) {
        const errorDetails = await response.json();

        switch (errorDetails.message) {
          case "Invalid input data":
            throw new Error(
              "The input data provided is invalid. Please check the fields and try again."
            );
          case "User is not authenticated":
            throw new Error(
              "You are not authenticated. Please log in and try again."
            );
          case "An unexpected error occurred. Please try again later.":
            throw new Error(
              "Something went wrong on the server. Please try again later."
            );
          default:
            throw new Error(
              errorDetails.message || "An unknown error occurred."
            );
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding discussion:", error.message);
      alert(error.message);
    }
  }

  const handleFormSubmit = async (formData) => {
    const newReview = {
      ...formData,
      createdBy: " ",
    };

    await addReview(newReview);
  };

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/create-review"
            element={<ReviewForm onSubmit={handleFormSubmit} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/edit-review/:id" element={<EditReview />} />

          {/* <Route path="/dashboard" element={<Dashboard />} />  */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
