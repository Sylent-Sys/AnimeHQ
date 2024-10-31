import { z } from "zod";
import mediaSchema from "../schema/media.schema";
import { useState } from "react";
import { GoMute, GoUnmute } from "react-icons/go";

export default function PreviewCard({
  media,
}: {
  media: z.infer<typeof mediaSchema>["data"]["Page"]["media"][number];
}) {
  const [hideIframe, setHideIframe] = useState(true);
  const [muted, setMuted] = useState(true);
  return (
    <div className="rounded-xl shadow-xl absolute bottom-0 left-[-20%] bg-base-300 w-[140%] h-96 transition duration-300 ease-in-out hover:scale-105 z-40">
      <div className="w-full h-[40%] relative overflow-hidden">
        <img
          src={
            media.bannerImage ||
            `https://i.ytimg.com/vi/${media.trailer?.id}/hqdefault.jpg` ||
            " "
          }
          alt="banner"
          className="rounded-t-xl absolute w-full h-full object-cover object-center"
        />
        <div className="absolute z-10 right-0 m-2">
          <button
            type="button"
            className="bg-base-content text-white rounded-full p-2"
            onClick={() => setMuted((prev) => !prev)}
          >
            {!muted ? <GoUnmute /> : <GoMute />}
          </button>
        </div>
        <iframe
          className={`rounded-t-xl w-full h-full border-0 absolute left-0 ${hideIframe ? "hidden" : ""}`}
          title={media.title?.userPreferred ?? "A"}
          allow="autoplay"
          onLoad={(e) => {
            e.preventDefault();
            setHideIframe(false);
          }}
          src={`https://www.youtube-nocookie.com/embed/${media.trailer?.id}?autoplay=1&controls=0&mute=${muted ? 1 : 0}&disablekb=1&loop=1&vq=medium&playlist=${media.trailer?.id}&cc_lang_pref=ja`}
        />
      </div>
      <div className="py-2 px-4">
        <p className="line-clamp-1 font-bold">{media.title?.userPreferred}</p>
        <div className="flex flex-row gap-1 font-bold">
          {[
            media.format,
            media.duration + " Episodes",
            [media.season?.toLowerCase(), media.seasonYear]
              .filter((s) => !!s)
              .map(
                (s) =>
                  s!.toString().charAt(0).toUpperCase() +
                  s!.toString().slice(1),
              )
              .join(" "),
          ].map((text, index, array) => (
            <div key={index} className="flex flex-row gap-1 text-sm">
              <span>{text}</span>
              {index !== array.length - 1 && <span>&#x2027;</span>}
            </div>
          ))}
        </div>
        <p className="line-clamp-4 text-xs">
          {media.description?.replace(/<[^>]*>/g, "")}
        </p>
      </div>
    </div>
  );
}
