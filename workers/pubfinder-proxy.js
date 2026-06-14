// Cloudflare Worker — PubFinder FSQ proxy
// Forwards place searches to Foursquare's Places API, injecting the
// FSQ_KEY secret server-side so it never touches the browser.
//
// Setup:
//   1. Create a Worker at dash.cloudflare.com → Workers & Pages → Create
//   2. Paste this script, click Deploy
//   3. Settings → Variables and Secrets → add FSQ_KEY (secret) = your FSQ Service API Key
//   4. Copy the worker URL (*.workers.dev) into PubFinder → ⚙️ Settings → Proxy URL

const FSQ_URL = "https://places-api.foursquare.com/places/search";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const { search } = new URL(request.url);

    const fsqRes = await fetch(`${FSQ_URL}${search}`, {
      headers: {
        Authorization: `Bearer ${env.FSQ_KEY}`,
        "X-Places-Api-Version": "2025-06-17",
      },
    });

    const body = await fsqRes.text();
    return new Response(body, {
      status: fsqRes.status,
      headers: { "Content-Type": "application/json", ...CORS },
    });
  },
};
