import { z } from "zod";
import FetchDataHelper from "../../../helper/FetchDataHelper";
import genreCollectionSchema from "../../../schema/genre-collection.schema";
import { useEffect, useState } from "react";
import mediaSchema from "../../../schema/media.schema";
import { SearchVariables } from "../../../interfaces/anilist-helper.interface";
import CardMedia from "../../../component/CardMedia";
import { useSearchParams } from "react-router-dom";

export default function AnimeSearch() {
  const { fetchData: fetchGenreCollection, ...genreCollectionData } =
    FetchDataHelper<z.infer<typeof genreCollectionSchema>>();
  const { fetchData: fetchSearch, ...searchData } =
    FetchDataHelper<z.infer<typeof mediaSchema>>();

  const [searchQuery, setSearchQuery] = useState<SearchVariables>({});
  const [debouncedQuery, setDebouncedQuery] = useState<SearchVariables>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (!firstRender) {
      return;
    }
    const params: SearchVariables = {
      search: searchParams.get("search") || undefined,
      genre: searchParams.get("genre") || undefined,
      season: searchParams.get("season") || undefined,
      year: Number(searchParams.get("year")) || undefined,
      format: searchParams.get("format") || undefined,
      status: searchParams.get("status") || undefined,
      sort: searchParams.get("sort") || undefined,
    };
    setSearchQuery(params);
    setFirstRender(false);
  }, [searchParams, firstRender]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchGenreCollection(
      window.anilistHelper.getGenresCollection(genreCollectionSchema),
    );
  }, [fetchGenreCollection]);

  useEffect(() => {
    if (Object.keys(debouncedQuery).length > 0) {
      fetchSearch(
        window.anilistHelper.search(
          { ...debouncedQuery, page: 1, perPage: 40 },
          mediaSchema,
        ),
      );
    }
  }, [fetchSearch, debouncedQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(searchQuery).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    setSearchParams(params);
  }, [searchQuery, setSearchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-row gap-4">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-3xl font-bold">Title</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            name="search"
            onChange={handleInputChange}
            value={searchQuery.search || ""}
          />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-3xl font-bold">Genre</span>
          </div>
          <select
            className="select select-bordered"
            name="genre"
            onChange={handleInputChange}
            value={searchQuery.genre || ""}
          >
            <option value="">Any</option>
            {genreCollectionData.data?.data.GenreCollection.map(
              (genre: string) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-3xl font-bold">Season</span>
          </div>
          <div className="flex flex-row">
            <select
              className="w-1/2 select select-bordered rounded-r-none"
              name="season"
              onChange={handleInputChange}
              value={searchQuery.season || ""}
            >
              <option value="">Any</option>
              {Object.entries(
                window.anilistHelper.getSearchVariables().MediaSeason,
              ).map(([key, value]: [string, string]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            <select
              className="w-1/2 select select-bordered rounded-l-none"
              name="year"
              onChange={handleInputChange}
              value={searchQuery.year || ""}
            >
              <option value="">Any</option>
              {Array.from(
                { length: new Date().getFullYear() - 1940 + 3 },
                (_, i) => (
                  <option key={i} value={new Date().getFullYear() + 2 - i}>
                    {new Date().getFullYear() + 2 - i}
                  </option>
                ),
              )}
            </select>
          </div>
        </label>

        {["format", "status", "sort"].map((field) => (
          <label key={field} className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-3xl font-bold">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </span>
            </div>
            <select
              className="select select-bordered"
              name={field}
              onChange={handleInputChange}
              value={String(searchQuery[field as keyof SearchVariables]) || ""}
            >
              <option value="">Any</option>
              {Object.entries(
                window.anilistHelper.getSearchVariables()[
                  `Media${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof object
                ] as Record<string, string>,
              ).map(([key, value]: [string, string]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex justify-center items-center">
          <p className="text-sm p-2 font-bold">Applied Filter</p>
        </div>
        {Object.entries(searchQuery).map(
          ([key, value]: [string, string]) =>
            value && (
              <div className="flex justify-center items-center" key={key}>
                <p className="text-sm font-bold bg-base-300 p-2 rounded-lg">
                  {String(value)
                    .split("_")
                    .map((v) => {
                      return (
                        v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
                      );
                    })
                    .join(" ")}
                </p>
              </div>
            ),
        )}
        <div className="ml-auto">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (
                Object.values(searchQuery).every((value) => value === undefined)
              ) {
                return;
              }
              setSearchQuery({
                search: undefined,
                genre: undefined,
                season: undefined,
                year: undefined,
                format: undefined,
                status: undefined,
                sort: undefined,
              });
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-xl font-bold">Result</p>
        <CardMedia
          media={searchData.data?.data.Page.media ?? null}
          loading={searchData.loading}
        />
      </div>
    </div>
  );
}
