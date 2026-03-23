import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Summary from "./pages/Summary";
import Quiz from "./pages/Quiz";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/summary/:id"
          element={
            <PrivateRoute>
              <Summary />
            </PrivateRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}

export default App;