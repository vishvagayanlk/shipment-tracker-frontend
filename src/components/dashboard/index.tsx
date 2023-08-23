import { useState, useEffect, lazy, useCallback, FC } from "react";
import ShipmentList from "./ShipmentList";
import { useNavigate } from "react-router-dom";
import { Shipment } from "./types";
import Banner from "../../services/Banner";
import { useAuth } from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";

const ShipmentForm = lazy(() => import("./ShipmentForm"));

const Dashboard: FC = () => {
  const [shipments, setShipments] = useState<Array<Shipment>>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isLoading, data, makeApiCall } = useApi<Array<Shipment>>();

  useEffect(() => {
    if (!isLoading && data) {
      setShipments(data);
    }
  }, [data]);

  const fetchShipments = async () => {
    try {
      makeApiCall("/shipment/all", {
        method: "GET",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleToggleForm = useCallback(() => {
    setShowForm((prevShowForm) => !prevShowForm);
  }, []);

  const onClickLogout = async () => {
    try {
      makeApiCall("/auth/logout", { method: "GET" });
      logout();
      navigate("/");
    } catch (error) {
      return <Banner type={"ERROR"} message={`Error while logins out`} />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h1>
      <div className="mb-4">
        <button
          onClick={handleToggleForm}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Create Shipment
        </button>
        <button
          onClick={onClickLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      {showForm ? (
        <ShipmentForm
          onSuccess={(shipmentData: Shipment) => {
            const updatedShipments = [...shipments, shipmentData];
            setShipments(updatedShipments);
            setShowForm(false);
          }}
          onClose={() => {
            setShowForm(false);
          }}
        />
      ) : null}
      {isLoading && data ? (
        <p>Loading...</p>
      ) : (
        <ShipmentList shipments={shipments} onUpdateTracking={fetchShipments} />
      )}
    </div>
  );
};

export default Dashboard;
