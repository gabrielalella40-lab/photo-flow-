export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    route: "/api/checkout",
    method: "GET",
  });
}

export async function POST() {
  return Response.json({
    ok: true,
    route: "/api/checkout",
    method: "POST",
  });
}