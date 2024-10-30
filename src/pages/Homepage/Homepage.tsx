import { Swiper, SwiperSlide } from "swiper/react";
import SwiperDefault from "swiper";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useRef } from "react";
import "./Homepage.css";
import FetchDataHelper from "../../helper/FetchDataHelper";
import mediaSchema from "../../schema/media.schema";
import { currentSeason, currentYear } from "../../helper/AnilistHelper";
import { z } from "zod";
function App() {
  const progressCircle = useRef<SVGSVGElement>(null);
  const progressContent = useRef<HTMLSpanElement>(null);
  const onAutoplayTimeLeft = (
    _s: SwiperDefault,
    time: number,
    progress: number,
  ) => {
    if (!progressCircle.current || !progressContent.current) return;
    progressCircle.current.style.setProperty(
      "--progress",
      String(1 - progress),
    );
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  const { fetchData: fetchBanner, ...bannerData } =
    FetchDataHelper<z.infer<typeof mediaSchema>>();
  useEffect(() => {
    fetchBanner(
      window.anilistHelper.search(
        {
          sort: "POPULARITY_DESC",
          perPage: 15,
          onList: false,
          season: currentSeason,
          year: currentYear,
          status_not: "NOT_YET_RELEASED",
        },
        mediaSchema,
      ),
    );
  }, [fetchBanner]);
  return (
    <div>
      {bannerData.data && (
        <Swiper
          className="h-[40vh]"
          slidesPerView={1}
          autoplay={{
            delay: 1000000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          keyboard={true}
          mousewheel={true}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          modules={[Pagination, Autoplay]}
        >
          {bannerData.data.data.Page.media?.map((media) => (
            <SwiperSlide key={media.id}>
              <img
                src={
                  media?.bannerImage ??
                  `https://i.ytimg.com/vi/${media.trailer?.id}/maxresdefault.jpg`
                }
                alt={media.title?.romaji ?? "banner"}
                className="w-full h-full object-cover object-center"
              />
              <div className="bg-gradient-to-t from-[#17191D] h-1/2 absolute bottom-0 w-full" />
              <div className="bg-gradient-to-r from-[#17191D] h-full absolute bottom-0 w-1/2" />
              <div className="absolute bottom-0 text-white p-4 font-bold">
                <p className="text-5xl">{media.title?.userPreferred}</p>
                <div className="flex flex-row gap-1">
                  {[
                    media.format,
                    media.duration,
                    [media.season?.toLowerCase(), media.seasonYear]
                      .filter((s) => !!s)
                      .map(
                        (s) =>
                          s!.toString().charAt(0).toUpperCase() +
                          s!.toString().slice(1),
                      )
                      .join(" "),
                  ].map((text, index, array) => (
                    <>
                      <span key={text}>{text}</span>
                      {index !== array.length - 1 && <span>&#x2027;</span>}
                    </>
                  ))}
                </div>
                <div className="w-1/2 line-clamp-4">
                  {media.description?.replace(/<[^>]*>/g, "")}
                </div>
                <div className="w-1/2 flex flex-row gap-1">
                  {media.genres?.map((genre, index, array) => (
                    <>
                      <span key={genre}>{genre}</span>
                      {index !== array.length - 1 && <span>&#x2027;</span>}
                    </>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div
            className="absolute right-4 bottom-4 z-10 w-12 h-12 flex items-center justify-center font-bold"
            slot="container-end"
          >
            <svg
              viewBox="0 0 48 48"
              ref={progressCircle}
              className="svgProgress absolute left-0 top-0 w-full h-full transform -rotate-90"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                className="fill-none stroke-[--swiper-theme-color]"
              ></circle>
            </svg>
            <span ref={progressContent}></span>
          </div>
        </Swiper>
      )}
    </div>
  );
}

export default App;
