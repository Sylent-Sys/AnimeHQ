import { z } from "zod";

export default z
  .object({
    data: z
      .object({
        MediaListCollection: z
          .object({
            lists: z
              .array(
                z
                  .object({
                    status: z.string().optional().nullable(),
                    entries: z
                      .array(
                        z
                          .object({
                            media: z
                              .object({
                                id: z.number().optional().nullable(),
                                status: z.string().optional().nullable(),
                                mediaListEntry: z
                                  .object({
                                    progress: z.number().optional().nullable(),
                                  })
                                  .optional()
                                  .nullable(),
                                nextAiringEpisode: z
                                  .object({
                                    episode: z.number().optional().nullable(),
                                  })
                                  .optional()
                                  .nullable(),
                                relations: z
                                  .object({
                                    edges: z
                                      .array(
                                        z
                                          .object({
                                            relationType: z
                                              .string()
                                              .optional()
                                              .nullable(),
                                            node: z
                                              .object({
                                                id: z
                                                  .number()
                                                  .optional()
                                                  .nullable(),
                                              })
                                              .optional()
                                              .nullable(),
                                          })
                                          .optional()
                                          .nullable(),
                                      )
                                      .optional()
                                      .nullable(),
                                  })
                                  .optional()
                                  .nullable(),
                              })
                              .optional()
                              .nullable(),
                          })
                          .optional()
                          .nullable(),
                      )
                      .optional()
                      .nullable(),
                  })
                  .optional()
                  .nullable(),
              )
              .optional()
              .nullable(),
          })
          .optional()
          .nullable(),
      })
      .optional()
      .nullable(),
  })
  .optional()
  .nullable();
