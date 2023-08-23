import { useState, useEffect, lazy, useCallback, FC } from "react";
import ShipmentList from "./ShipmentList";
import { Shipment } from "./types";
import useApi from "../../hooks/useApi";
import Logout from "../auth/logout";

const ShipmentForm = lazy(() => import("./ShipmentForm"));

const Dashboard: FC = () => {
  const [shipments, setShipments] = useState<Array<Shipment>>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
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
        <Logout />
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
