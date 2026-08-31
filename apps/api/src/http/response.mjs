export function json(res, status, body, origin = "*") { res.writeHead(status, { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": origin }); res.end(JSON.stringify(body)); }
export function cors(res, origin = "*") { res.writeHead(204, { "access-control-allow-origin": origin, "access-control-allow-methods": "GET,POST,PATCH,OPTIONS", "access-control-allow-headers": "content-type" }); res.end(); }

