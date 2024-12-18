import { handleList } from './handlers/list';
import { handleGet } from './handlers/get';
import { sourcesRegistry } from './sources';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    sourcesRegistry.initialize(env);

    const url = new URL(request.url);
    
    if (url.pathname === '/api/list') {
      return handleList(request);
    }
    
    if (url.pathname === '/api/get') {
      return handleGet(request, env);
    }
    
    return new Response('Not found', { status: 404 });
  }
};