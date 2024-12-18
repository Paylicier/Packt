import { ShipmentInfo } from '../schemas/shipment';

export interface SourceConfig {
  name: string;
  icon?: string;
  requiredFields: string[];
  baseUrl: string;
  apiKey?: string;
}

export abstract class TrackingSource {
  constructor(protected config: SourceConfig) {}
  
  abstract getTracking(params: Record<string, string>, env: any): Promise<ShipmentInfo>;
  
  getConfig(): SourceConfig {
    return this.config;
  }
}