import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Login from "./components/auth/Login";
import ShipmentTracking from "./components/ShipmentTracking";
import Protected from "./components/Protected";
import ErrorBoundary from "./services/ErrorBoundary";
import Registration from "./components/auth/Registration";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { isAuthenticated } = useAuth();
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Dashboard /> : <Registration />}
          />
          <Route
            path="/dashboard"
            element={<Protected element={<Dashboard />} />}
          />
          <Route path="/track" element={<ShipmentTracking />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
