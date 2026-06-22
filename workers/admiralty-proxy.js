// Cloudflare Worker — Admiralty UKHO Tidal API proxy
// Admiralty's API doesn't send CORS headers, so a browser can't call it directly.
// This worker forwards /Stations and /Stations/{id}/TidalEvents requests to the
// Admiralty API, injecting the ADMIRALTY_KEY secret server-side so it never
// touches the browser. Only requests from ALLOWED_ORIGINS get a response, since
// the worker URL itself is public (committed in supconditions.html) and would
// otherwise let anyone burn through the free API quota.
//
// Setup:
//   1. Create a Worker at dash.cloudflare.com → Workers & Pages → Create
//   2. Paste this script, click Deploy
//   3. Settings → Variables and Secrets → add ADMIRALTY_KEY (secret) = your Admiralty Discovery key
//   4. Copy the worker URL (*.workers.dev) into SUP Conditions → ⚙️ Settings → Proxy URL

const ADMIRALTY_BASE = "https://admiraltyapi.azure-api.net/uktidalapi/api/V1";

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
    const admRes = await fetch(`${ADMIRALTY_BASE}${url.pathname}${url.search}`, {
      headers: { "Ocp-Apim-Subscription-Key": env.ADMIRALTY_KEY },
    });

    const body = await admRes.text();
    return new Response(body, {
      status: admRes.status,
      headers: { "Content-Type": "application/json", ...headers },
    });
  },
};
