// Cloudflare Worker — PubFinder FSQ proxy
// Forwards any /places/* path to Foursquare's Places API, injecting the
// FSQ_KEY secret server-side so it never touches the browser. Only requests
// from ALLOWED_ORIGINS get a response, since the worker URL itself is public
// (committed in pubfinder.html) and would otherwise let anyone burn through
// the free API quota.
//
// Setup:
//   1. Create a Worker at dash.cloudflare.com → Workers & Pages → Create
//   2. Paste this script, click Deploy
//   3. Settings → Variables and Secrets → add FSQ_KEY (secret) = your FSQ Service API Key
//   4. Copy the worker URL (*.workers.dev) into PubFinder → ⚙️ Settings → Proxy URL

const FSQ_BASE = "https://places-api.foursquare.com";

const ALLOWED_ORIGINS = ["https://bobusfindus-byte.github.io"];

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : "null",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response("Forbidden", { status: 403, headers });
    }

    const url = new URL(request.url);
    const fsqPath = url.pathname === "/" ? "/places/search" : url.pathname;
    const fsqRes = await fetch(`${FSQ_BASE}${fsqPath}${url.search}`, {
      headers: {
        Authorization: `Bearer ${env.FSQ_KEY}`,
        "X-Places-Api-Version": "2025-06-17",
      },
    });

    const body = await fsqRes.text();
    return new Response(body, {
      status: fsqRes.status,
      headers: { "Content-Type": "application/json", ...headers },
    });
  },
};
