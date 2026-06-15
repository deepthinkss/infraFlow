import { delay, http, HttpResponse } from "msw";
import { apps, graphs } from "./data";

const API_DELAY_MS = 650;

export const handlers = [
  http.get("/api/apps", async () => {
    await delay(API_DELAY_MS);
    return HttpResponse.json(apps);
  }),
  http.get("/api/apps/:id/graph", async ({ params }) => {
    await delay(API_DELAY_MS);

    const id = String(params.id);
    const graph = graphs[id];

    if (!graph) {
      return HttpResponse.json({ message: "Application graph not found" }, { status: 404 });
    }

    return HttpResponse.json(graph);
  }),
];
