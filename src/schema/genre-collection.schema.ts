import { z } from "zod";

export default z.object({
  data: z.object({ GenreCollection: z.array(z.string()) }),
});
