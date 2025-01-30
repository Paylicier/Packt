import { TrackingSource, SourceConfig } from "../base";
import { ShipmentInfo } from "../../schemas/shipment";

let token: string | undefined;
let lastTokenUpdate: number | undefined;

export class FedexSource extends TrackingSource {
  constructor(env: Record<string, string>) {
    super({
      name: "fedex",
      icon: "fedex.png",
      requiredFields: ["trackingNumber"],
      baseUrl: "https://apis.fedex.com", // "https://apis-sandbox.fedex.com
      apiKey: { key: env.FEDEX_API_KEY, secret: env.FEDEX_SECRET_KEY },
    });
  }

  async getTracking(params: Record<string, string>): Promise<ShipmentInfo> {
    if (
      !token ||
      !lastTokenUpdate ||
      Date.now() - lastTokenUpdate > 50 * 60 * 1000
    ) {
      const response = await fetch(this.config.baseUrl + "/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body:
          "grant_type=client_credentials&client_id=" +
          this.config.apiKey.key +
          "&client_secret=" +
          this.config.apiKey.secret,
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.errors[0].message ?? "Failed to fetch token");
      }
      token = data.access_token;
      lastTokenUpdate = Date.now();
    }

    const response = await fetch(
      this.config.baseUrl + "/track/v1/trackingnumbers",
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          trackingInfo: [
            {
              trackingNumberInfo: {
                trackingNumber: params.trackingNumber,
              },
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(
        data.errors[0]?.code ?? "Failed to fetch shipment information"
      );
    }

    const trackResult = data?.output?.completeTrackResults[0]?.trackResults[0];
    const lastStatus = trackResult?.latestStatusDetail;
    const events = trackResult?.scanEvents;

    if (!trackResult || !lastStatus || !events) {
      throw new Error("Failed to fetch shipment information");
    }

    return {
      trackingNumber: trackResult.trackingNumberInfo.trackingNumber,
      trackingUrl: `https://www.fedex.com/fedextrack/?trknbr=${trackResult.trackingNumberInfo.trackingNumber}`,
      carrier: "fedex",
      status: {
        code: getTrackingProgress(lastStatus.code),
        description: lastStatus.statusByLocale,
        timestamp:
          trackResult.dateAndTimes.find((d) => d.type === "ACTUAL_DELIVERY")
            ?.dateTime || events[0]?.date,
        location: formatLocation(lastStatus.scanLocation),
      },
      estimatedDelivery: trackResult.standardTransitTimeWindow?.window?.ends,
      events: events.map((event) => ({
        code: event.eventType ?? event.eventDescription ?? "N/A",
        description:
          event.eventDescription +
          (event.exceptionDescription
            ? ` - ${event.exceptionDescription}`
            : ""),
        timestamp: event.date,
        location: formatLocation(event.scanLocation),
      })),
    };
  }
}

// Todo : move formatLocation to an utils file

const formatLocation = (location: any): string | undefined => {
  if (!location) return undefined;

  const parts = [
    location.city,
    location.stateOrProvinceCode,
    location.countryName,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : undefined;
};

const getTrackingProgress = (code) => {

  // source : https://developer.fedex.com/api/en-us/guides/api-reference.html

  const progressMap = {
    OC: 1.0,
    OF: 1.2,
    OX: 1.3, 
    PD: 1.8,
    AP: 2.0,
    PU: 2.1,
    PX: 2.2,
    DS: 2.3,
    DR: 2.4, 
    IT: 2.6,
    IX: 2.7,
    DP: 2.8,
    LO: 2.9,
    PF: 3.0,
    PL: 3.1,
    TR: 3.2,
    PM: 3.3,
    SF: 3.4,
    AA: 3.5,
    AC: 3.6,
    AF: 3.7,
    AX: 3.8,
    FD: 3.9,
    CC: 3.9,
    CD: 3.9,
    CP: 3.9,
    EA: 4.0,
    ED: 4.1,
    EO: 4.2,
    EP: 4.3,
    OD: 4.4,
    DE: 4.5,
    DD: 4.6,
    DY: 4.7,
    SE: 4.8,
    AO: 4.9,
    DL: 5.0,
    CA: 5.0,
    RS: 4.6,
    RP: 4.7,
    LP: 4.8,
    RG: 4.8, 
    RD: 4.9,
    CH: 3.5,
    HL: 3.5,
    SP: 3.5,
  };

  return (progressMap as any)[code] ?? code;
};
