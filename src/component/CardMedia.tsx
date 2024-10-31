import { z } from "zod";
import mediaSchema from "../schema/media.schema";

export default function CardMedia({
  media,
}: {
  media: z.infer<typeof mediaSchema>["data"]["Page"]["media"];
}) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
      {media?.length == 0
        ? Array.from({ length: 16 }).map((_, index) => (
            <div className="rounded w-full h-96 animate-pulse" key={index}>
              <div className="bg-base-content w-full h-full"></div>
            </div>
          ))
        : media?.map((media) => (
            <div
              className="rounded-xl bg-base-300 h-96 w-full shadow-xl"
              key={media.id}
            >
              <img
                src={
                  media?.coverImage?.extraLarge ??
                  `https://i.ytimg.com/vi/${media.trailer?.id}/maxresdefault.jpg`
                }
                alt={media.title?.romaji ?? "banner"}
                className="rounded-t-xl object-cover object-center w-full h-72"
              />
              <div className="h-24 py-2 px-4 font-bold flex flex-col justify-between">
                <p className="line-clamp-2">{media.title?.userPreferred}</p>
                <p className="flex flex-row justify-between">
                  <span className="line-clamp-1">
                    {media.seasonYear || "N/A"}
                  </span>
                  <span className="line-clamp-1">
                    {media.format
                      ?.split("_")
                      .map((value) => {
                        return value.charAt(0).toUpperCase() + value.slice(1);
                      })
                      .join(" ")}
                  </span>
                </p>
              </div>
            </div>
          ))}
    </div>
  );
}
