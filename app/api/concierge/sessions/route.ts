import { proxyConciergeRequest } from "@/lib/api/concierge-proxy";

export async function POST(request: Request) {
  return proxyConciergeRequest(request, "/concierge/sessions");
}
