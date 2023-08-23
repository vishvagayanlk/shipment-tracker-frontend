import { FC } from "react";

interface ShipmentDetailsFieldProps {
  value: string;
  fieldName: string;
}

const ShipmentDetailsField: FC<ShipmentDetailsFieldProps> = ({
  value,
  fieldName,
}) => {
  return (
    <div className="mb-2">
      <span className="font-semibold">{fieldName}:</span>
      {value}
    </div>
  );
};

export default ShipmentDetailsField;
