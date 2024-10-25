import { z } from "zod";

export default z.object({
  data: z.object({
    Viewer: z.object({
      avatar: z.object({ medium: z.string() }),
      name: z.string(),
      id: z.number(),
      mediaListOptions: z.object({
        animeList: z.object({ customLists: z.array(z.string()) }),
      }),
    }),
  }),
});
