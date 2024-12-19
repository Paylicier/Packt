import { sourcesRegistry } from '../sources';

export async function handleGet(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const source = url.searchParams.get('source');
  
  if (!source || !sourcesRegistry.has(source)) {
    return new Response('Source not found', { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  const trackingSource = sourcesRegistry.get(source)!;
  const params: Record<string, string> = {};
  
  for (const field of trackingSource.getConfig().requiredFields) {
    const value = url.searchParams.get(field);
    if (!value) {
      return new Response(`Missing required field: ${field}`, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
    params[field] = value;
  }

  try {
    const info = await trackingSource.getTracking(params, env);
    return new Response(JSON.stringify(info), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return new Response("{\"error\": \"" + (error?.message ?? "server error") + "\"}", { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}