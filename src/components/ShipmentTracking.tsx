import { useEffect, useState } from "react";
import Banner from "../services/Banner";
import useApi from "../hooks/useApi";

interface Errors {
  trackingCode: { isError: boolean; message?: string };
}

interface TrackingDetails {
  status: string;
  description: string;
  userName: string;
}

const ShipmentTracking = () => {
  const [trackingCode, setTrackingCode] = useState<string>("");
  const [trackingDetails, setTrackingDetails] =
    useState<TrackingDetails | null>(null);
  const [error, setError] = useState<Errors>({
    trackingCode: {
      isError: true,
      message: "Please fill Tracking Number",
    },
  });
  const { isLoading, data, makeApiCall } = useApi<TrackingDetails>();
  const onChangeTrackingCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTrackingCode(input);
    setError({
      ...error,
      trackingCode: {
        isError: input === "",
        message: input === "" ? "Please Enter description" : "",
      },
    });
  };
  useEffect(() => {
    if (!isLoading && data) {
      setTrackingDetails(data);
    }
  }, [isLoading, data]);

  const handleTrackShipment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      makeApiCall("/track", {
        method: "GET",
        queryParams: {
          trackingCode,
        },
      });
    } catch (error) {
      return (
        <Banner
          message="An error occurred while tracking the shipment."
          type={"ERROR"}
        />
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Track Shipment</h2>
      <form onSubmit={handleTrackShipment} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium">Tracking Number:</label>
          <input
            type="text"
            value={trackingCode}
            onChange={onChangeTrackingCode}
            className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
          />
          {error.trackingCode.isError && (
            <div className="text-red-500 mb-4">
              {error.trackingCode.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Track
        </button>
      </form>
      {trackingDetails && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipment Details</h3>
          <ul className="list-disc pl-6">
            <li>Status: {trackingDetails.status}</li>
            <li>Description: {trackingDetails.description}</li>
            <li>Shipment Creator Name: {trackingDetails.userName}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShipmentTracking;
