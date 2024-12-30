import { TrackingSource, SourceConfig } from "../base";
import { ShipmentInfo } from "../../schemas/shipment";

export class LaposteSource extends TrackingSource {
  constructor(env: Record<string, string>) {
    super({
      name: "laposte",
      icon: "laposte.png",
      requiredFields: ["trackingNumber"],
      baseUrl: "https://api.laposte.fr/suivi/v2",
      apiKey: env.LAPOSTE_API_KEY,
    });
  }

  async getTracking(params: Record<string, string>): Promise<ShipmentInfo> {
    console.log(this.config.apiKey);
    const response = await fetch(
      `${this.config.baseUrl}/idships/${params.trackingNumber}`,
      {
        headers: {
          accept: "application/json",
          "X-Okapi-Key": this.config.apiKey as string,
        },
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      console.log(data);
      throw new Error(data.message ?? "Failed to fetch shipment information");
    }

    return {
      trackingNumber: data.shipment.idShip,
      trackingUrl: data.shipment.url,
      carrier: "laposte",
      status: {
        code: data.shipment.timeline
          .filter((event) => event.status)
          .slice(-1)[0]
          .id.toString(),
        description: data.shipment.event[0].label,
        timestamp: data.shipment.event[0].date,
        location: undefined,
      },
      estimatedDelivery: undefined,
      events: data.shipment.event.map((event) => ({
        code: event.code,
        description: event.label,
        timestamp: event.date,
        location: undefined,
      })),
    };
  }
}
