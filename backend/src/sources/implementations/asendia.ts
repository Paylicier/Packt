import { TrackingSource, SourceConfig } from '../base';
import { ShipmentInfo } from '../../schemas/shipment';

export class AsendiaSource extends TrackingSource {
  constructor(env: Record<string, string>) {
    super({
      name: 'asendia',
      icon: 'asendia.png',
      requiredFields: ['trackingNumber'],
      baseUrl: 'https://a1reportapi.asendiaprod.com/api/A1/',
      apiKey: env.A1_API_KEY
    });
  }

  async getTracking(params: Record<string, string>): Promise<ShipmentInfo> {
    const response = await fetch(`${this.config.baseUrl}TrackingBranded/Tracking?trackingKey=AE654169-0B14-45F9-8498-A8E464E13D26&trackingNumber=${params.trackingNumber}`, {
      headers: {
        'accept': 'application/json',
        'authorization': `Basic ${this.config.apiKey}`,
        'content-type': 'application/json',
        'x-asendiaone-apikey': '32337AB0-45DD-44A2-8601-547439EF9B55'
      }
    });
    
    const data = await response.json();

    if(response.status !== 200) {
      console.log(data);
      throw new Error('Failed to fetch shipment information');
    }
    
    return {
      trackingNumber: params.trackingNumber,
      carrier: 'asendia',
      status: {
      code: data.trackingBrandedDetail[0].eventCode,
      description: data.trackingBrandedDetail[0].eventDescription,
      timestamp: data.trackingBrandedDetail[0].eventOn,
      location: data.trackingBrandedDetail[0].eventLocationDetails?.countryName ? 
        `${data.trackingBrandedDetail[0].eventLocationDetails.city ? data.trackingBrandedDetail[0].eventLocationDetails.city + ', ' : ''}${data.trackingBrandedDetail[0].eventLocationDetails.province ? data.trackingBrandedDetail[0].eventLocationDetails.province + ' ' : ''}${data.trackingBrandedDetail[0].eventLocationDetails.countryName}` : 
        undefined
      },
      estimatedDelivery: undefined,
      events: data.trackingBrandedDetail.map(event => ({
      code: event.eventCode,
      description: event.eventDescription,
      timestamp: event.eventOn,
      location: event.eventLocationDetails?.countryName ? 
        `${event.eventLocationDetails.city ? event.eventLocationDetails.city + ', ' : ''}${event.eventLocationDetails.province ? event.eventLocationDetails.province + ' ' : ''}${event.eventLocationDetails.countryName}` : 
        undefined
      }))
    };
  }
}