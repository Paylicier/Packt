import { TrackingSource } from './base';
import { AsendiaSource } from './implementations/asendia';
import { MRSource } from './implementations/mondialrelay';
import { UPSSource } from './implementations/ups';
import { ColissimoSource } from './implementations/colissimo';
import { ChronopostSource } from './implementations/chronopost';
import { LaposteSource } from './implementations/laposte';
import { DHLSource } from './implementations/dhl';
import { FedexSource } from './implementations/fedex';

class SourcesRegistry {
  private sources: Map<string, TrackingSource> = new Map();

  register(source: TrackingSource): void {
    const config = source.getConfig();
    this.sources.set(config.name, source);
  }

  get(name: string): TrackingSource | undefined {
    return this.sources.get(name);
  }

  has(name: string): boolean {
    return this.sources.has(name);
  }

  entries(): IterableIterator<[string, TrackingSource]> {
    return this.sources.entries();
  }

  initialize(env: any): void {
    this.sources.clear();
    //this.register(new UPSSource(env)); Prod doesn't have UPS API key
    this.register(new MRSource(env));
    this.register(new AsendiaSource(env));
    this.register(new ColissimoSource(env));
    this.register(new ChronopostSource(env));
    this.register(new LaposteSource(env));
    this.register(new DHLSource(env));
    this.register(new FedexSource(env));
  }
}

export const sourcesRegistry = new SourcesRegistry();