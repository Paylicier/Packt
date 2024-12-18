import { sourcesRegistry } from '../sources';

export async function handleList(request: Request): Promise<Response> {
  const sources = Array.from(sourcesRegistry.entries()).map(([name, source]) => ({
    name,
    icon: source.getConfig().icon,
    requiredFields: source.getConfig().requiredFields
  }));
  
  return new Response(JSON.stringify(sources), {
    headers: { 'Content-Type': 'application/json' }
  });
}