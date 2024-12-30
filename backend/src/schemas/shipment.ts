export interface ShipmentStatus {
  code: string;
  description: string;
  timestamp: string;
  location?: string;
}

export interface ShipmentInfo {
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
  status: ShipmentStatus;
  estimatedDelivery?: string;
  events: ShipmentStatus[];
}
