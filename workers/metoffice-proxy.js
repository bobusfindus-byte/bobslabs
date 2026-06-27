// Cloudflare Worker — Met Office DataHub proxy
// Forwards Site-Specific forecast requests to the Met Office DataHub API,
// injecting the METOFFICE_KEY secret server-side so it never touches the
// browser. Only requests from ALLOWED_ORIGINS get a response, since the
// worker URL itself is committed in darksky_4.html and would otherwise let
// anyone burn through the API quota.
//
// Setup:
//   1. Create a Worker at dash.cloudflare.com → Workers & Pages → Create
//   2. Paste this script, click Deploy
//   3. Settings → Variables and Secrets → add METOFFICE_KEY (secret) = your DataHub API key
//   4. Copy the worker URL (*.workers.dev) into Skyline Weather → ⚙️ Settings → Met Office Proxy URL

const METOFFICE_BASE = "https://data.hub.api.metoffice.gov.uk";

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
    const moRes = await fetch(`${METOFFICE_BASE}${url.pathname}${url.search}`, {
      headers: { apikey: env.METOFFICE_KEY },
    });

    const body = await moRes.text();
    return new Response(body, {
      status: moRes.status,
      headers: { "Content-Type": "application/json", ...headers },
    });
  },
};
