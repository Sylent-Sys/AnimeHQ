import { SearchVariables } from "../interfaces/anilist-helper.interface";
import { FetchDataHelperProps } from "../interfaces/fetch-data-helper.interface";
import { ZodSchema } from "zod";

const queryObject = `id,
idMal,
title {
  romaji,
  english,
  native,
  userPreferred
},
description(asHtml: false),
season,
seasonYear,
format,
status,
episodes,
duration,
averageScore,
genres,
isFavourite,
coverImage {
  extraLarge,
  medium,
  color
},
source,
countryOfOrigin,
isAdult,
bannerImage,
synonyms,
nextAiringEpisode {
  timeUntilAiring,
  episode
},
startDate {
  year,
  month,
  day
},
trailer {
  id,
  site
},
streamingEpisodes {
  title,
  thumbnail
},
mediaListEntry {
  id,
  progress,
  repeat,
  status,
  customLists(asArray: true),
  score(format: POINT_10)
},
studios(isMain: true) {
  nodes {
    name
  }
},
airingSchedule(page: 1, perPage: 1, notYetAired: true) {
  nodes {
    episode,
    airingAt
  }
},
relations {
  edges {
    relationType(version:2),
    node {
      id,
      title {userPreferred},
      coverImage {medium},
      type,
      status,
      format,
      episodes,
      synonyms,
      season,
      seasonYear,
      startDate {
        year,
        month,
        day
      },
      endDate {
        year,
        month,
        day
      }
    }
  }
}`;
const date = new Date();
export const currentSeason = ["WINTER", "SPRING", "SUMMER", "FALL"][
  Math.floor((date.getMonth() / 12) * 4) % 4
];
export const currentYear = date.getFullYear();
export class AnilistHelper {
  requestFactory(
    query: string,
    variables: unknown,
    schema: ZodSchema,
  ): FetchDataHelperProps {
    return {
      method: "POST",
      schema,
      apiUrl: "https://graphql.anilist.co",
      url: "/",
      axiosConfig: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          query: query,
          variables: variables,
        },
      },
    };
  }
  getAuthenticatedUser(schema: ZodSchema) {
    const query = `
        query {
  Viewer {
    avatar {
      medium
    }
    name
    id
    mediaListOptions {
      animeList {
        customLists
      }
    }
  }
}
        `;
    return this.requestFactory(query, {}, schema);
  }
  search(variables: SearchVariables = {}, schema: ZodSchema) {
    variables.sort ||= "SEARCH_MATCH";
    const query = ` 
    query($page: Int, $perPage: Int, $sort: [MediaSort], $search: String, $onList: Boolean, $status: MediaStatus, $status_not: MediaStatus, $season: MediaSeason, $year: Int, $genre: String, $format: MediaFormat) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        },
        media(type: ANIME, search: $search, sort: $sort, onList: $onList, status: $status, status_not: $status_not, season: $season, seasonYear: $year, genre: $genre, format: $format, format_not: MUSIC) {
          ${queryObject}
        }
      }
    }`;
    return this.requestFactory(query, variables, schema);
  }
  getUserMedia(id: number, schema: ZodSchema) {
    const query = `
    query($id: Int) {
        MediaListCollection(userId: $id, type: ANIME, forceSingleCompletedList: true, sort: UPDATED_TIME_DESC) {
          lists {
            status,
            entries {
              media {
                id,
                status,
                mediaListEntry {
                  progress
                },
                nextAiringEpisode {
                  episode
                },
                relations {
                  edges {
                    relationType(version:2)
                    node {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    return this.requestFactory(query, { id }, schema);
  }
  searchByIds(
    id: number[],
    variables: SearchVariables = {},
    schema: ZodSchema,
  ) {
    variables.sort ||= "SEARCH_MATCH";
    const query = ` 
    query($id: [Int], $page: Int, $perPage: Int, $status: [MediaStatus], $onList: Boolean, $sort: [MediaSort], $search: String, $season: MediaSeason, $year: Int, $genre: String, $format: MediaFormat) { 
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        },
        media(id_in: $id, type: ANIME, status_in: $status, onList: $onList, search: $search, sort: $sort, season: $season, seasonYear: $year, genre: $genre, format: $format) {
          ${queryObject}
        }
      }
    }`;
    return this.requestFactory(query, { id, ...variables }, schema);
  }
  getGenresCollection(schema: ZodSchema) {
    const query = `
      query {
        GenreCollection
      }
    `;
    return this.requestFactory(query, {}, schema);
  }
  getSearchVariables() {
    const MediaStatus = {
      FINISHED: "FINISHED",
      RELEASING: "RELEASING",
      NOT_YET_RELEASED: "NOT YET RELEASED",
      CANCELLED: "CANCELLED",
      HIATUS: "HIATUS",
    };
    const MediaSeason = {
      WINTER: "WINTER",
      SPRING: "SPRING",
      SUMMER: "SUMMER",
      FALL: "FALL",
    };
    const MediaFormat = {
      TV: "TV",
      TV_SHORT: "TV SHORT",
      MOVIE: "MOVIE",
      SPECIAL: "SPECIAL",
      OVA: "OVA",
      ONA: "ONA",
    };
    const MediaSort = {
      START_DATE_DESC: "Release Date",
      SCORE_DESC: "Score",
      POPULARITY_DESC: "Popularity",
      TRENDING_DESC: "Trending",
      UPDATED_AT_DESC: "Updated Date",
    };
    return { MediaStatus, MediaSeason, MediaFormat, MediaSort };
  }
}
