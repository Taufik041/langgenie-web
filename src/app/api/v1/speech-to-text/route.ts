import { handleV1 } from "@/lib/v1-handler";
export const runtime = "nodejs";
export const POST = (req: Request) => handleV1(req, "/v1/speech-to-text");
