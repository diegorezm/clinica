import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...routes]]/route";

export const client = hc<AppType>("/");
