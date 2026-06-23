import { proxyConciergeRequest } from "@/lib/api/concierge-proxy";

export async function GET(request: Request) {
  return proxyConciergeRequest(request, "/concierge/config");
}
