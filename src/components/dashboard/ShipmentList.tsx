import React, { lazy, useCallback, useState } from "react";
import { Shipment } from "./types";
import ShipmentDetailsField from "./ShipmentDetailsField";

const TrackingForm = lazy(() => import("./TrackingForm"));

interface ShipmentListProps {
  shipments: Array<Shipment>;
  onUpdateTracking: () => void;
}

const ShipmentList: React.FC<ShipmentListProps> = ({
  shipments,
  onUpdateTracking,
}) => {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  const handleUpdateTracking = useCallback((shipmentId: string) => {
    setSelectedShipment(shipmentId);
  }, []);

  if (!shipments?.length) {
    return <></>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shipment List</h2>
      <ul>
        {shipments.map((shipment) => (
          <li key={shipment._id} className="border rounded p-4 mb-4 shadow">
            <ShipmentDetailsField
              value={shipment.senderName}
              fieldName="Sender name"
            />
            <ShipmentDetailsField
              value={shipment.recipientName}
              fieldName="Recipient name"
            />
            <ShipmentDetailsField
              value={shipment.senderAddress}
              fieldName="Sender Address"
            />
            <ShipmentDetailsField
              value={shipment.recipientAddress}
              fieldName="Recipient Address"
            />
            <ShipmentDetailsField
              value={shipment.description}
              fieldName="Descriptions"
            />
            <ShipmentDetailsField
              value={shipment.trackingDetails?.[0]?.status || "Not available"}
              fieldName="Tracking Status"
            />
            <ShipmentDetailsField
              value={
                shipment.trackingDetails?.[0]?.description || "Not available"
              }
              fieldName="Tracking Description"
            />
            <ShipmentDetailsField
              value={
                shipment.trackingDetails?.[0]?.trackingCode || "Not available"
              }
              fieldName="Tracking Code"
            />
            {selectedShipment === shipment._id ? (
              <TrackingForm
                trackingDetailsId={shipment.trackingDetails[0]._id}
                onUpdate={() => {
                  onUpdateTracking();
                  setSelectedShipment(null);
                }}
                onClose={() => setSelectedShipment(null)}
              />
            ) : (
              <button
                onClick={() => handleUpdateTracking(shipment._id)}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Update Tracking
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShipmentList;
