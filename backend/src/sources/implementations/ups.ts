import { TrackingSource, SourceConfig } from '../base';
import { ShipmentInfo } from '../../schemas/shipment';

// 1Z262AY97298603378

export class UPSSource extends TrackingSource {
  constructor(env: Record<string, string>) {
    super({
      name: 'ups',
      icon: 'ups.png',
      requiredFields: ['trackingNumber'],
      baseUrl: 'https://webapis.ups.com/track/api',
      apiKey: env.UPS_API_KEY
    });
  }

  async getTracking(params: Record<string, string>): Promise<ShipmentInfo> {
    console.log('UPS getTracking', params);
    const response = await fetch(`${this.config.baseUrl}/Track/GetStatus?loc=en_US`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': this.config.apiKey as string,
        },
        body: JSON.stringify({
            Locale: 'en_US',
            TrackingNumber: [params.trackingNumber]
        })
    });
    console.log(response);
    const data = await response.json();

    if(response.status !== 200) {
      throw new Error('Failed to fetch shipment information');
    }

    console.log(data);
    
    return {
      trackingNumber: params.trackingNumber,
      carrier: 'UPS',
      status: {
        code: data.status.code,
        description: data.status.description,
        timestamp: data.status.timestamp
      },
      events: data.events.map(e => ({
        code: e.code,
        description: e.description,
        timestamp: e.timestamp,
        location: e.location
      }))
    };
  }
}