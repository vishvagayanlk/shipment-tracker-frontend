import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Shipment } from "./types";
import useApi from "../../hooks/useApi";
import Banner from "../../services/Banner";

interface ShipmentFormProps {
  onSuccess: (shipment: Shipment) => void;
  onClose: () => void;
}
interface Errors {
  senderName: { isError: boolean; message?: string };
  senderAddress: { isError: boolean; message?: string };
  recipientName: { isError: boolean; message?: string };
  recipientAddress: { isError: boolean; message?: string };
  description: { isError: boolean; message?: string };
}

const ShipmentForm: FC<ShipmentFormProps> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    senderName: "",
    senderAddress: "",
    recipientName: "",
    recipientAddress: "",
    description: "",
  });

  const [error, setError] = useState<Errors>({
    senderName: { isError: true, message: "Please enter sender name" },
    senderAddress: { isError: true, message: "Please enter sender address" },
    recipientName: { isError: true, message: "Please enter recipient name" },
    recipientAddress: {
      isError: true,
      message: "Please enter recipient address",
    },
    description: { isError: true, message: "Please enter description" },
  });
  const { isLoading, data, makeApiCall } = useApi<Shipment>();
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: {
        isError: value === "",
        message: value === "" ? `Please enter ${name.toLowerCase()}` : "",
      },
    }));
  }, []);
  const isSubmitDisabled = useMemo((): boolean => {
    return (
      Object.values(error).some((field) => field.isError) ||
      Object.values(formData).some((value) => value === "")
    );
  }, [error, formData]);

  useEffect(() => {
    if (data && !isLoading) {
      setFormData({
        senderName: "",
        senderAddress: "",
        recipientName: "",
        recipientAddress: "",
        description: "",
      });
      onSuccess(data);
    }
  }, [data, isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      makeApiCall("/shipment/create", {
        method: "POST",
        data: formData,
      });
    } catch (error) {
      <Banner
        type={"ERROR"}
        message={`Error while creating shipment details error: ${error}`}
      />;
    }
  };

  if (isLoading) {
    return <div>Creating shipment ...</div>;
  }
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Sender Name:</label>
        <input
          type="text"
          name="senderName"
          placeholder="Sender Name"
          value={formData.senderName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
        />
      </div>
      {error.senderName.isError && <div>{error.senderName.message}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Sender Address:
        </label>
        <input
          type="text"
          name="senderAddress"
          placeholder="Sender Address"
          value={formData.senderAddress}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
        />
        {error.senderAddress.isError && (
          <div>{error.senderAddress.message}</div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Recipient Name:
        </label>
        <input
          type="text"
          name="recipientName"
          placeholder="Recipient Name"
          value={formData.recipientName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
        />
        {error.recipientName.isError && (
          <div>{error.recipientName.message}</div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Recipient Address:
        </label>
        <input
          type="text"
          name="recipientAddress"
          placeholder="Recipient Address"
          value={formData.recipientAddress}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
        />
        {error.recipientAddress.isError && (
          <div>{error.recipientAddress.message}</div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description:</label>
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
        />
        {error.description.isError && <div>{error.description.message}</div>}
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-2 rounded hover:bg-blue-600 ${
            isSubmitDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Create Shipment
        </button>
        <button
          onClick={onClose}
          className="ml-4 py-2 px-4 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default ShipmentForm;
