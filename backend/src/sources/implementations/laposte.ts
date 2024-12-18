import { TrackingSource, SourceConfig } from '../base';
import { ShipmentInfo } from '../../schemas/shipment';

export class LaposteSource extends TrackingSource {
  constructor(env: Record<string, string>) {
    super({
      name: 'laposte',
      icon: 'laposte.png',
      requiredFields: ['trackingNumber'],
      baseUrl: 'https://api.laposte.fr/suivi/v2',
      apiKey: env.LAPOSTE_API_KEY
    });
  }

  async getTracking(params: Record<string, string>): Promise<ShipmentInfo> {
    const response = await fetch(`${this.config.baseUrl}/idships/${params.trackingNumber}`, {
      headers: { 'accept': 'application/json', 'X-Okapi-Key': this.config.apiKey as string }
    });
    
    const data = await response.json();

    if(response.status !== 200) {
      console.log(data);
      throw new Error('Failed to fetch shipment information');
    }
      
    return {
      trackingNumber: params.trackingNumber,
      carrier: data.shipment.product ?? 'laposte',
      status: {
        code: data.timeline[data.timeline.length - 1].shortLabel,
        description: data.timeline[data.timeline.length - 1].longLabel,
        timestamp: data.event[0].date,
        location: data.contextData.arrivalCountry
      },
      estimatedDelivery: undefined,
      events: data.timeline.map(event => ({
        code: event.shortLabel,
        description: event.longLabel,
        timestamp: data.event[0].date,
        location: data.contextData.arrivalCountry
      }))
    };
  }
}