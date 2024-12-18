export interface ShipmentStatus {
    code: string;
    description: string;
    timestamp: string;
    location?: string;
  }
  
  export interface ShipmentInfo {
    trackingNumber: string;
    carrier: string;
    status: ShipmentStatus;
    estimatedDelivery?: string;
    events: ShipmentStatus[];
  }