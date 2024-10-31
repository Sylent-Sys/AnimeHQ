import { z } from "zod";

export default z.object({
  data: z.object({
    Page: z.object({
      pageInfo: z.object({
        hasNextPage: z.boolean().optional().nullable(),
      }),
      media: z
        .array(
          z.object({
            id: z.number().optional().nullable(),
            idMal: z.number().optional().nullable(),
            title: z
              .object({
                romaji: z.string().optional().nullable(),
                english: z.string().optional().nullable(),
                native: z.string().optional().nullable(),
                userPreferred: z.string().optional().nullable(),
              })
              .optional()
              .nullable(),
            description: z.string().optional().nullable(),
            season: z.string().optional().nullable(),
            seasonYear: z.number().optional().nullable(),
            format: z.string().optional().nullable(),
            status: z.string().optional().nullable(),
            episodes: z.number().optional().nullable(),
            duration: z.number().optional().nullable(),
            averageScore: z.number().optional().nullable(),
            genres: z.array(z.string()).optional().nullable(),
            isFavourite: z.boolean().optional().nullable(),
            coverImage: z
              .object({
                extraLarge: z.string().optional().nullable(),
                medium: z.string().optional().nullable(),
                color: z.string().optional().nullable(),
              })
              .optional()
              .nullable(),
            source: z.string().optional().nullable(),
            countryOfOrigin: z.string().optional().nullable(),
            isAdult: z.boolean().optional().nullable(),
            bannerImage: z.string().optional().nullable(),
            synonyms: z.array(z.string()).optional().nullable(),
            nextAiringEpisode: z
              .object({
                timeUntilAiring: z.number().optional().nullable(),
                episode: z.number().optional().nullable(),
              })
              .optional()
              .nullable(),
            startDate: z
              .object({
                year: z.number().optional().nullable(),
                month: z.number().optional().nullable(),
                day: z.number().optional().nullable(),
              })
              .optional()
              .nullable(),
            trailer: z
              .object({
                id: z.string().optional().nullable(),
                site: z.string().optional().nullable(),
              })
              .optional()
              .nullable(),
            streamingEpisodes: z
              .array(
                z.object({
                  title: z.string().optional().nullable(),
                  thumbnail: z.string().optional().nullable(),
                }),
              )
              .optional()
              .nullable(),
            mediaListEntry: z
              .object({
                id: z.number(),
                progress: z.number(),
                repeat: z.number(),
                status: z.string(),
                customLists: z.array(
                  z.object({ name: z.string(), enabled: z.boolean() }),
                ),
                score: z.number(),
              })
              .optional()
              .nullable(),
            studios: z
              .object({
                nodes: z
                  .array(
                    z.object({
                      name: z.string().optional().nullable(),
                    }),
                  )
                  .optional()
                  .nullable(),
              })
              .optional()
              .nullable(),
            airingSchedule: z
              .object({
                nodes: z
                  .array(
                    z.object({
                      episode: z.number().optional().nullable(),
                      airingAt: z.number().optional().nullable(),
                    }),
                  )
                  .optional()
                  .nullable(),
              })
              .optional()
              .nullable(),
            relations: z
              .object({
                edges: z
                  .array(
                    z.object({
                      relationType: z.string().optional().nullable(),
                      node: z
                        .object({
                          id: z.number().optional().nullable(),
                          title: z
                            .object({
                              userPreferred: z.string().optional().nullable(),
                            })
                            .optional()
                            .nullable(),
                          coverImage: z
                            .object({
                              medium: z.string().optional().nullable(),
                            })
                            .optional()
                            .nullable(),
                          type: z.string().optional().nullable(),
                          status: z.string().optional().nullable(),
                          format: z.string().optional().nullable(),
                          episodes: z.number().optional().nullable(),
                          synonyms: z.array(z.string()).optional().nullable(),
                          season: z.string().optional().nullable(),
                          seasonYear: z.number().optional().nullable(),
                          startDate: z
                            .object({
                              year: z.number().optional().nullable(),
                              month: z.number().optional().nullable(),
                              day: z.number().optional().nullable(),
                            })
                            .optional()
                            .nullable(),
                          endDate: z
                            .object({
                              year: z.number().optional().nullable(),
                              month: z.number().optional().nullable(),
                              day: z.number().optional().nullable(),
                            })
                            .optional()
                            .nullable(),
                        })
                        .optional()
                        .nullable(),
                    }),
                  )
                  .optional()
                  .nullable(),
              })
              .optional()
              .nullable(),
          }),
        )
        .optional()
        .nullable(),
    }),
  }),
});
