import { useState } from "react";
import { z } from "zod";
import mediaSchema from "../schema/media.schema";
import PreviewCard from "./PreviewCard";

export default function CardMedia({
  media,
  loading,
}: {
  loading: boolean;
  media: z.infer<typeof mediaSchema>["data"]["Page"]["media"] | null;
}) {
  const [hoveredMedia, setHoveredMedia] = useState<number | null>(null);

  const renderLoadingSkeleton = () => (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
      {Array.from({ length: 16 }).map((_, index) => (
        <div className="rounded w-full h-96 animate-pulse" key={index}>
          <div className="bg-base-content w-full h-full"></div>
        </div>
      ))}
    </div>
  );

  const renderMediaGrid = () => (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
      {media?.map((mediaItem) => (
        <div
          className="rounded-xl bg-base-300 h-96 w-full shadow-xl relative"
          key={mediaItem.id}
          onMouseEnter={() => setHoveredMedia(mediaItem.id ?? null)}
          onMouseLeave={() => setHoveredMedia(null)}
        >
          <img
            src={
              mediaItem.coverImage?.extraLarge ??
              `https://i.ytimg.com/vi/${mediaItem.trailer?.id}/maxresdefault.jpg`
            }
            alt={mediaItem.title?.romaji ?? "banner"}
            className="rounded-t-xl object-cover object-center w-full h-72"
          />
          <div className="h-24 py-2 px-4 font-bold flex flex-col justify-between">
            <p className="line-clamp-2">{mediaItem.title?.userPreferred}</p>
            <p className="flex flex-row justify-between">
              <span className="line-clamp-1">
                {mediaItem.seasonYear || "N/A"}
              </span>
              <span className="line-clamp-1">
                {mediaItem.format
                  ?.split("_")
                  .map(
                    (value) => value.charAt(0).toUpperCase() + value.slice(1),
                  )
                  .join(" ")}
              </span>
            </p>
          </div>
          {hoveredMedia === mediaItem.id && <PreviewCard media={mediaItem} />}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {loading || media == null ? (
        renderLoadingSkeleton()
      ) : media && media.length > 0 ? (
        renderMediaGrid()
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-xl font-bold">No Result Found</p>
        </div>
      )}
    </>
  );
}
