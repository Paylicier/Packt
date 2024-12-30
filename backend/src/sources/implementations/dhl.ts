import { TrackingSource, SourceConfig } from "../base";
import { ShipmentInfo } from "../../schemas/shipment";

export class DHLSource extends TrackingSource {
  constructor(env: Record<string, string>) {
    super({
      name: "dhl",
      icon: "dhl.png",
      requiredFields: ["trackingNumber"],
      baseUrl: "https://api-eu.dhl.com/",
      apiKey: env.DHL_API_KEY,
    });
  }

  async getTracking(params: Record<string, string>): Promise<ShipmentInfo> {
    const response = await fetch(
      `${this.config.baseUrl}track/shipments?trackingNumber=${params.trackingNumber}`,
      {
        headers: {
          accept: "application/json",
          "dhl-api-key": this.config.apiKey as string,
        },
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(data.detail || "Failed to fetch shipment information");
    }

    if (data.shipments.length === 0) {
      throw new Error("No shipment found");
    }
    return {
      trackingNumber: data.shipments[0].id,
      trackingUrl:
        "https://www.dhl.com/us-en/home/tracking.html?tracking-id=" +
        data.shipments[0].id,
      carrier: "dhl",
      status: {
        code: data.shipments[0].status.statusCode,
        description: data.shipments[0].status.description,
        timestamp: data.shipments[0].status.timestamp,
        location: data.shipments[0].status.location?.address?.addressLocality,
      },
      estimatedDelivery: undefined,
      events: data.shipments[0].events.map((event) => ({
        code: event.statusCode,
        description: event.status,
        timestamp: event.timestamp,
        location: event.location?.address?.addressLocality,
      })),
    };
  }
}
