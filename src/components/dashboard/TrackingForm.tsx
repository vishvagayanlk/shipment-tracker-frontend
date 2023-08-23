import React, { FC, useEffect, useMemo, useState } from "react";
import Banner from "../../services/Banner";
import { TrackingDetail } from "./types";
import useApi from "../../hooks/useApi";

interface TrackingFormProps {
  trackingDetailsId: string;
  onUpdate: () => void;
  onClose: () => void;
}

enum TrackingStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}

interface Errors {
  statusError: { isError: boolean; message?: string };
  descriptionError: { isError: boolean; message?: string };
}

const TrackingForm: FC<TrackingFormProps> = ({
  onClose,
  onUpdate,
  trackingDetailsId,
}) => {
  const [status, setStatus] = useState<TrackingStatus | "">("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<Errors>({
    statusError: { isError: true, message: "Please Select tracking status" },
    descriptionError: {
      isError: true,
      message: "Please Enter tracking description",
    },
  });
  const { isLoading, data, makeApiCall } = useApi<TrackingDetail>();
  const OnChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setError({
      ...error,
      descriptionError: {
        isError: input === "",
        message: input === "" ? "Please Enter description" : "",
      },
    });
    setDescription(input);
  };

  const isSubmitDisable = useMemo((): boolean => {
    return (
      (error.descriptionError.isError && error.descriptionError.isError) ||
      status === "" ||
      description === ""
    );
  }, [status, description]);

  useEffect(() => {
    if (!isLoading && data) {
      onUpdate();
      setStatus("");
      setDescription("");
    }
  }, [isLoading, data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      makeApiCall("/tracking/update", {
        method: "POST",
        data: {
          trackingDetailsId,
          status,
          description,
        },
      });
    } catch (error) {
      return (
        <Banner
          type={"ERROR"}
          message={`Error while updating tracking details error: ${error}`}
        />
      );
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status:</label>
        <select
          name="status"
          value={status}
          onChange={(e) => {
            setError({
              ...error,
              statusError: {
                isError: e.target.value === "",
                message:
                  e.target.value === "" ? "Please Select tracking status" : "",
              },
            });
            setStatus(e.target.value as TrackingStatus);
          }}
          className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="">Select Status</option>
          {Object.values(TrackingStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {error.statusError.isError && <div>{error.statusError.message}</div>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description:</label>
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={description}
          onChange={OnChangeDescription}
          className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
        />
        {error.descriptionError.isError && (
          <div>{error.descriptionError.message}</div>
        )}
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="submit"
          disabled={isSubmitDisable}
          className={`flex-1 py-2 rounded hover:bg-blue-600 ${
            isSubmitDisable
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Update Tracking Details
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

export default TrackingForm;
