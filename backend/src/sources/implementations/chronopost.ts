import { TrackingSource, SourceConfig } from '../base';
import { ShipmentInfo } from '../../schemas/shipment';
import { sourcesRegistry } from '..';


export class ChronopostSource extends TrackingSource {
  constructor(env: Record<string, string>) {
    super({
      name: 'chronopost',
      icon: 'chronopost.png',
      requiredFields: ['trackingNumber'],
      baseUrl: 'https://api.laposte.fr/suivi/v2',
      apiKey: env.LAPOSTE_API_KEY
    });
  }

  async getTracking(params: Record<string, string>): Promise<ShipmentInfo> {
    const trackingSource = sourcesRegistry.get('laposte')!;
    const info = await trackingSource.getTracking(params, { LAPOSTE_API_KEY:this.config.apiKey });
    return info;
  }
}