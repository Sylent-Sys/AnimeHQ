import { Swiper, SwiperSlide } from "swiper/react";
import SwiperDefault from "swiper";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useRef } from "react";
import "./Homepage.css";
import FetchDataHelper from "../../helper/FetchDataHelper";
import mediaSchema from "../../schema/media.schema";
import { currentSeason, currentYear } from "../../helper/AnilistHelper";
import { z } from "zod";
import CardMedia from "../../component/CardMedia";
import { useUserStore } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
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
  const userStore = useUserStore();
  const navigate = useNavigate();
  const { fetchData: fetchPopularThisSeason, ...popularThisSeasonData } =
    FetchDataHelper<z.infer<typeof mediaSchema>>();
  const { fetchData: fetchTrendingNow, ...trendingNowData } =
    FetchDataHelper<z.infer<typeof mediaSchema>>();
  const { fetchData: fetchAllTimePopular, ...allTimePopularData } =
    FetchDataHelper<z.infer<typeof mediaSchema>>();
  const { fetchData: fetchUserMedia, ...userMediaData } =
    FetchDataHelper<z.infer<typeof mediaSchema>>();
  const { fetchData: fetchBanner, ...bannerData } =
    FetchDataHelper<z.infer<typeof mediaSchema>>();
  useEffect(() => {
    fetchBanner(
      window.anilistHelper.search(
        {
          sort: "POPULARITY_DESC",
          perPage: 5,
          onList: false,
          season: currentSeason,
          year: currentYear,
          status_not: "NOT_YET_RELEASED",
        },
        mediaSchema,
      ),
    );
  }, [fetchBanner]);
  useEffect(() => {
    fetchAllTimePopular(
      window.anilistHelper.search(
        { sort: "POPULARITY_DESC", page: 1, perPage: 16 },
        mediaSchema,
      ),
    );
  }, [fetchAllTimePopular]);
  useEffect(() => {
    fetchPopularThisSeason(
      window.anilistHelper.search(
        {
          sort: "POPULARITY_DESC",
          season: currentSeason,
          year: currentYear,
          page: 1,
          perPage: 16,
        },
        mediaSchema,
      ),
    );
  }, [fetchPopularThisSeason]);
  useEffect(() => {
    fetchTrendingNow(
      window.anilistHelper.search(
        { sort: "TRENDING_DESC", page: 1, perPage: 16 },
        mediaSchema,
      ),
    );
  }, [fetchTrendingNow]);
  useEffect(() => {
    if (userStore.userMedia && userStore.user) {
      const mediaIds =
        userStore.userMedia.data?.MediaListCollection?.lists
          ?.find((list) => list?.status == "PLANNING")
          ?.entries?.map((entries) => entries?.media?.id)
          ?.filter((id): id is number => id !== null && id !== undefined) ?? [];
      fetchUserMedia(
        window.anilistHelper.searchByIds(
          mediaIds,
          {
            page: 1,
            perPage: 16,
          },
          mediaSchema,
        ),
      );
    }
  }, [fetchUserMedia, userStore.user, userStore.userMedia]);
  return (
    <div className="overflow-hidden min-h-screen">
      {bannerData.data?.data == null && (
        <div className="h-[40vh] animate-pulse">
          <div className="bg-base-content w-full h-full" />
        </div>
      )}
      {bannerData.data && (
        <Swiper
          className="h-[40vh]"
          slidesPerView={1}
          autoplay={{
            delay: 10000,
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
                    <div key={index} className="flex flex-row gap-1">
                      <span>{text}</span>
                      {index !== array.length - 1 && <span>&#x2027;</span>}
                    </div>
                  ))}
                </div>
                <div className="w-1/2 line-clamp-4">
                  {media.description?.replace(/<[^>]*>/g, "")}
                </div>
                <div className="w-1/2 flex flex-row gap-1 line-clamp-1">
                  {media.genres?.map((genre, index, array) => (
                    <div key={index} className="flex flex-row gap-1">
                      <span key={genre}>{genre}</span>
                      {index !== array.length - 1 && <span>&#x2027;</span>}
                    </div>
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
            <span className="text-white" ref={progressContent}></span>
          </div>
        </Swiper>
      )}
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <p className="text-xl font-bold">Trending Now</p>
            <button
              type="button"
              className="text-xl font-bold"
              onClick={() => {
                const url = new URL(window.location.origin + "/anime/search");
                url.searchParams.set("sort", "TRENDING_DESC");
                navigate(url.toString().replace(window.location.origin, ""));
              }}
            >
              View More
            </button>
          </div>
          <CardMedia
            media={trendingNowData.data?.data.Page.media ?? null}
            loading={trendingNowData.loading}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <p className="text-xl font-bold">Popular This Season</p>
            <button
              type="button"
              className="text-xl font-bold"
              onClick={() => {
                const url = new URL(window.location.origin + "/anime/search");
                url.searchParams.set("sort", "POPULARITY_DESC");
                url.searchParams.set("season", currentSeason);
                url.searchParams.set("year", currentYear.toString());
                navigate(url.toString().replace(window.location.origin, ""));
              }}
            >
              View More
            </button>
          </div>
          <CardMedia
            media={popularThisSeasonData.data?.data.Page.media ?? null}
            loading={popularThisSeasonData.loading}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <p className="text-xl font-bold">All Time Popular</p>
            <button
              type="button"
              className="text-xl font-bold"
              onClick={() => {
                const url = new URL(window.location.origin + "/anime/search");
                url.searchParams.set("sort", "POPULARITY_DESC");
                navigate(url.toString().replace(window.location.origin, ""));
              }}
            >
              View More
            </button>
          </div>
          <CardMedia
            media={allTimePopularData.data?.data.Page.media ?? null}
            loading={allTimePopularData.loading}
          />
        </div>
        {userStore.userMedia && userStore.user && (
          <div className="flex flex-col gap-4">
            <p className="text-xl font-bold">My List</p>
            <CardMedia
              media={userMediaData.data?.data.Page.media ?? null}
              loading={userMediaData.loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
