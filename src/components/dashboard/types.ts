export interface TrackingDetail {
  _id: string;
  status: string;
  trackingCode: string;
  description: string;
  createdBy: string;
  __v: number;
}

export interface Shipment {
  _id: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  description: string;
  createdBy: string;
  trackingId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  trackingDetails: TrackingDetail[];
}
