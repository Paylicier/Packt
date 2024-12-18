import { TrackingSource, SourceConfig } from '../base';
import { ShipmentInfo } from '../../schemas/shipment';

// https://crispy-potato-r4grqvq7wrg63xwgv-8787.app.github.dev/api/get?source=mondialrelay&trackingNumber=XXXXXXXX&countryCode=fr&postalCode=XXXX

export class MRSource extends TrackingSource {
  constructor(env: Record<string, string>) {
    super({
      name: 'mondialrelay',
      icon: 'mondialrelay.png',
      requiredFields: ['trackingNumber', 'countryCode', 'postalCode'],
      baseUrl: 'https://www.mondialrelay.fr/api/',
      apiKey: env.MR_API_KEY
    });
  }

  async getTracking(params: Record<string, string>): Promise<ShipmentInfo> {
    const response = await fetch(`${this.config.baseUrl}tracking?shipment=${params.trackingNumber}&postcode=${params.postalCode}&codePays=${params.countryCode}`, {
      headers: { 'RequestVerificationToken': this.config.apiKey as string }
    });
    
    const data = await response.json();

    if(response.status !== 200) {
      console.log(data);
      throw new Error('Failed to fetch shipment information');
    }
    
    const lastEvent = data.Expedition.Evenements[data.Expedition.Evenements.length - 1];
    
    return {
      trackingNumber: params.trackingNumber,
      carrier: 'mondialrelay',
      status: {
        code: data.Expedition.SuiviParEtapes[Object.keys(data.Expedition.SuiviParEtapes).length].Numero.toString(),
        description: lastEvent.Libelle,
        timestamp: lastEvent.Date,
        location: lastEvent.DetailPointRelais ? 
          `${lastEvent.DetailPointRelais.Adresse.Libelle}, ${lastEvent.DetailPointRelais.Adresse.AdresseLigne1}, ${lastEvent.DetailPointRelais.Adresse.CodePostal} ${lastEvent.DetailPointRelais.Adresse.Ville}` : 
          undefined
      },
      estimatedDelivery: undefined,
      events: data.Expedition.Evenements.map(event => ({
        code: -1,
        description: event.Libelle,
        timestamp: event.Date,
        location: event.DetailPointRelais ? 
          `${event.DetailPointRelais.Adresse.Libelle}, ${event.DetailPointRelais.Adresse.AdresseLigne1}, ${event.DetailPointRelais.Adresse.CodePostal} ${event.DetailPointRelais.Adresse.Ville}` : 
          undefined
      }))
    };
  }
}