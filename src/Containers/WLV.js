import React, { useCallback, useEffect, useState, memo } from "react";
import style from "./Sass/wlv.module.scss";
import { PlaySvg, QueueSvg } from "../Components/VideoComponents/Svg";
import {
  ShuffleSvg,
  SortBySvg,
  DRSvg,
  AddPlayListSvg,
  TrashSvg,
  MoveDownSvg,
  MoveUpSvg,
} from "./Svg";
import Head from "../Components/ComponentsUtils/Head";
import { DotsSvg } from "../Components/Navbar/NavComponents/Svg";
import { RippleButton } from "../Components/ComponentsUtils";
import {
  HandleDuration,
  ReturnTheme,
  TextReducer,
  PageLocation,
  GetClassName,
} from "../utils";
import { useSelector, useDispatch } from "react-redux";
import {
  ADDInQueueAction,
  ShowQueueAction,
  SetUrlLocationAction,
  Wl_RemoveOneAtion,
  Lv_RemoveOneAtion,
  Wl_RemoveAllAtion,
  Lv_RemoveAllAtion,
  Wl_MoveUpAtion,
  Lv_MoveUpAtion,
  Wl_MoveDownAtion,
  Lv_MoveDownAtion,
  fetchPlayList,
  PlayQueueAction,
  HideGuideAction,
  SetGuideModeAction,
} from "../redux";
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router";
import { useFetch } from "../Components/hooks/useFetch";

const DropMenu = memo(
  (
    index,
    Theme,
    HandleQueueClick,
    wl,
    HandleRemoveOne,
    HandleMoveUp,
    HandleMoveDown
  ) => {
    const txt_area = GetClassName(style, "drop_text_con__text", Theme);
    const drop_text_con = GetClassName(style, "drop_text_con", Theme);

    return (
      <div
        style={{ display: "none" }}
        className={GetClassName(style, "menu_drop", Theme)}
        id={`wl-mn-${index}`}
      >
        <div
          onClick={() =>
            HandleQueueClick(
              wl.title,
              wl.duration,
              wl.videoId,
              wl.channelTitle,
              wl.channelId,
              wl.thumbnail
            )
          }
          className={drop_text_con}
        >
          <div className={style.drop_text_con__icon}>
            <QueueSvg default_color={false} />
          </div>
          <div className={txt_area}>Add to queue</div>
        </div>
        <div className={drop_text_con}>
          <div className={style.drop_text_con__icon}>
            <AddPlayListSvg />
          </div>
          <div className={txt_area}>Save to playlist</div>
        </div>
        <div
          style={{ margin: "5px 0" }}
          className={`line line--${ReturnTheme(Theme)}`}
        ></div>
        <div
          onClick={() => HandleRemoveOne(wl.videoId)}
          className={drop_text_con}
        >
          <div className={style.drop_text_con__icon}>
            <TrashSvg />
          </div>
          <div className={txt_area}>Remove from Watch later</div>
        </div>
        <div onClick={() => HandleMoveUp(index)} className={drop_text_con}>
          <div className={style.drop_text_con__icon}>
            <MoveUpSvg />
          </div>
          <div className={txt_area}>Move to top</div>
        </div>
        <div onClick={() => HandleMoveDown(index)} className={drop_text_con}>
          <div className={style.drop_text_con__icon}>
            <MoveDownSvg />
          </div>
          <div className={txt_area}>Move to bottom</div>
        </div>
      </div>
    );
  }
);

const WLV = memo(() => {
  // WLV : Watch Later and Liked Videos
  const WatchLater = useSelector((state) => state.WLV.WL);
  const LikedVideos = useSelector((state) => state.WLV.LV);
  const PlayList = useSelector((state) => state.WLV.PlayList);

  // urlLocation
  const UrlLocation = useSelector((state) => state.Guide.UrlLocation);
  const Guide = useSelector((state) => state.Guide);
  //const guideMode = useSelector((state) => state.Guide.guideMode);

  // Queue
  const ShowQueue = useSelector((state) => state.DisplayQueue);
  const QueueList = useSelector((state) => state.QueueList);

  // Theme
  const Theme = useSelector((state) => state.Theme.isDarkTheme);
  // account
  const accounts = useSelector((state) => state.Navbar.accounts);

  // dispatch
  const dispatch = useDispatch();

  // menu drop state
  const [showMenudrop, setShowMenudrop] = useState(false);

  // menu drop state
  const [showRemoveAllDrop, setShowRemoveAllDrop] = useState(false);

  // current clicked menu index drop
  const [CurrentMenuIndex, setCurrentMenuIndex] = useState(0);

  const [ChalId, setChalId] = useState(false);

  const [VidDetailState, setVidDetailState] = useState(false);

  const [titleState, setTitleState] = useState({ title: "" });

  // ==========

  // A custom hook that builds on useLocation to parse
  // the query string for you.
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();

  let SearchValue = query.get("list");

  // ==========

  useEffect(() => {
    const pageManager = document.getElementById("page-manager");
    if (pageManager) {
      pageManager.style.marginLeft = Guide.showGuide ? "240px" : "72px";
    }
    // Do not put showGuide in the dependency array
  }, []);

  useEffect(() => {
    const UrlLoc = PageLocation();

    if (UrlLoc !== UrlLocation) {
      dispatch(SetUrlLocationAction(UrlLoc));
    }

    // Put SearchValue in the dependencies array to trigger useEffect
    // when we change the url from playlist?list=WL to playlist?list=LV.
  }, [UrlLocation, dispatch, SearchValue]);

  // ===================
  //  Remove one item
  // ===================
  const HandleRemoveOne = useCallback(
    (videoId) => {
      if (SearchValue === "WL") {
        dispatch(Wl_RemoveOneAtion(videoId));
      } else if (SearchValue === "LV") {
        dispatch(Lv_RemoveOneAtion(videoId));
      }
    },
    [SearchValue, dispatch]
  );

  //
  const HandleRemoveAll = () => {
    if (SearchValue === "WL") {
      dispatch(Wl_RemoveAllAtion());
    } else if (SearchValue === "LV") {
      dispatch(Lv_RemoveAllAtion());
    }
  };

  //
  const HandleMoveUp = useCallback(
    (index) => {
      if (SearchValue === "WL") {
        dispatch(Wl_MoveUpAtion(index));
      } else if (SearchValue === "LV") {
        dispatch(Lv_MoveUpAtion(index));
      }
    },
    [SearchValue, dispatch]
  );

  //
  const HandleMoveDown = useCallback(
    (index) => {
      if (SearchValue === "WL") {
        dispatch(Wl_MoveDownAtion(index));
      } else if (SearchValue === "LV") {
        dispatch(Lv_MoveDownAtion(index));
      }
    },
    [SearchValue, dispatch]
  );

  // ===================
  // Close menu dropdown
  // ===================
  const HandleCloseMenudrop = useCallback(() => {
    setShowMenudrop(() => false);
    const Menu = document.getElementById(`wl-mn-${CurrentMenuIndex}`);
    if (Menu != null) {
      Menu.style.display = "none";
    }
    document.removeEventListener("click", HandleCloseMenudrop);
  }, [setShowMenudrop, CurrentMenuIndex]);

  // ===================
  // Show menu dropdown
  // ===================
  const HandleShowMenudrop = useCallback(
    (e) => {
      // responsive dropdown
      // 213px is the menu height + 68px img height + 16 padding

      if (e.clientY > window.innerHeight - 297) {
        document.getElementById(`wl-mn-${CurrentMenuIndex}`).style.top = "-95%";
        document.getElementById(`wl-mn-${CurrentMenuIndex}`).style.right =
          "10%";
      }

      if (!showMenudrop) {
        document.addEventListener("click", HandleCloseMenudrop);
        document.getElementById(`wl-mn-${CurrentMenuIndex}`).style.display = "";
      } else {
        document.removeEventListener("click", HandleCloseMenudrop);
        document.getElementById(`wl-mn-${CurrentMenuIndex}`).style.display =
          "none";
      }
      setShowMenudrop(() => !showMenudrop);
    },
    [setShowMenudrop, showMenudrop, HandleCloseMenudrop, CurrentMenuIndex]
  );

  // ===================
  //   Show mini Drop
  // ===================

  const HandleCloseMinidrop = useCallback(() => {
    document.removeEventListener("click", HandleCloseMinidrop);
    setShowRemoveAllDrop(false);
  }, []);

  const HandleshowMiniDrop = useCallback(() => {
    if (!showRemoveAllDrop) {
      document.addEventListener("click", HandleCloseMinidrop);
      setShowRemoveAllDrop(true);
    } else {
      document.removeEventListener("click", HandleCloseMinidrop);
      setShowRemoveAllDrop(false);
    }
  }, [setShowRemoveAllDrop, showRemoveAllDrop, HandleCloseMinidrop]);

  // =========================
  //  Handle add to Queue btn
  // =========================

  const HandleQueueClick = useCallback(
    (title, duration, videoId, channelTitle, channelId, thumbnail) => {
      const checkVid = QueueList.filter((vid) => {
        return vid.videoId === videoId;
      });

      if (checkVid.length === 0 || QueueList.length === 0) {
        if (!ShowQueue) {
          dispatch(ShowQueueAction());
        }

        const playing = QueueList.length === 0;

        dispatch(
          ADDInQueueAction({
            title,
            duration,
            videoId,
            channelTitle,
            channelId,
            thumbnail,
            playing,
            index: QueueList.length,
          })
        );
      }
    },
    [QueueList, dispatch, ShowQueue]
  );

  // =================================
  //     FETCH CHANNELS SNIPPET
  // =================================

  const snippet = useFetch(ChalId, "channels", "snippet");

  // =========================
  //  fetching for thumbnails
  // =========================

  const CurrentAccount = useCallback(
    (title) => {
      const channel = document.getElementById("_channel_");
      const name = document.getElementById("_name_");

      if (SearchValue === "WL" || SearchValue === "LV") {
        const acc = accounts.filter((acc) => acc.isCurrent)[0];
        if (channel && name) {
          channel.src = acc.img;
          name.textContent = acc.name;
        }
      } else {
        if (channel && name && Object.keys(snippet).length !== 0) {
          channel.src = snippet.snippet.thumbnails.medium.url;
          name.textContent = title;
        }
      }
    },
    [SearchValue, accounts, snippet]
  );
  // ============================
  //  check is the current page
  // ============================

  const PageData = useCallback(() => {
    if (SearchValue === "WL") {
      return WatchLater;
    } else if (SearchValue === "LV") {
      return LikedVideos;
    } else {
      if (!PlayList.loading) {
        return PlayList.items;
      } else {
        return [];
      }
    }
  }, [LikedVideos, PlayList, SearchValue, WatchLater]);

  useEffect(() => {
    if (SearchValue !== "WL" && SearchValue !== "LV") {
      dispatch(fetchPlayList(SearchValue));
    }
  }, [dispatch, SearchValue]);

  useEffect(() => {
    if (!PlayList.loading) {
      CurrentAccount(PlayList.items[0].channelTitle);
      setChalId(PlayList.items[0].channelId);
      setTitleState({ title: PlayList.items[0].title });
    } else {
      // false here is just a placehoder
      CurrentAccount(false, false);
    }
  }, [PlayList, CurrentAccount]);

  // =========================
  //  FETCH VIDEOS DETAILS
  // =========================

  const VideoDetails = useFetch(
    VidDetailState,
    "videos",
    "contentDetails,statistics"
  );

  const FetchStat = (id, index) => {
    if (!VidDetailState) {
      // To prevent too many re-renders
      setVidDetailState(id);
    }

    if (Object.keys(VideoDetails).length !== 0) {
      const durationIdElement = document.getElementById(
        `wl-${id}-${index}-duration`
      );

      if (durationIdElement) {
        durationIdElement.textContent = HandleDuration(
          VideoDetails.contentDetails.duration
        );
      }
    }
  };

  // ===================
  //  Handle Thumbnail
  // ===================

  const Thumbnail = useCallback(() => {
    const thumbnail = document.getElementById("wlv-thumbnail");

    if (thumbnail) {
      thumbnail.src = PageData()[0].thumbnail;
    }
  }, [PageData]);

  // ===================
  //   Handle Skeleton
  // ===================

  const HandleSkeleton = useCallback(() => {
    //
    const wl_sklt = document.getElementById("wl-sklt");
    if (wl_sklt) {
      wl_sklt.style.height = "200px";
      wl_sklt.style.backgroundColor = Theme ? "#38383898" : "#e2e2e298";
    }
  }, [Theme]);

  // ----------------------------

  useEffect(() => {
    const length = PageData().length;
    if (length !== 0) {
      Thumbnail();
    } else {
      HandleSkeleton();
    }
  }, [PageData, HandleSkeleton, Thumbnail]);

  // ======================
  //  redirect with params
  // ======================

  //
  let history = useHistory();

  const HandleLink = useCallback(
    (wl) => {
      if (ShowQueue) {
        HandleQueueClick(
          wl.title,
          wl.duration,
          wl.videoId,
          wl.channelTitle,
          wl.channelId,
          wl.thumbnail
        );
        dispatch(PlayQueueAction(wl.videoId));
      } else {
        // for a smooth guide transition
        dispatch(HideGuideAction());
        dispatch(SetGuideModeAction(2));
        dispatch(SetUrlLocationAction("watch"));
        history.push(`/watch?v=${wl.videoId}`);
      }
    },
    [history, HandleQueueClick, ShowQueue, dispatch]
  );

  return (
    <div id="page-manager" className={GetClassName(style, "container", Theme)}>
      {/* Helmet */}
      {SearchValue === "WL" ? (
        <Head>
          <title>Watch later - youtube</title>
          <meta name="youtube clone watch later" />
        </Head>
      ) : SearchValue === "LV" ? (
        <Head>
          <title>Liked Videos - youtube</title>
          <meta name="youtube clone liked videos" />
        </Head>
      ) : (
        <Head>
          <title>{`${titleState.title}`} - youtube</title>
          <meta name="youtube clone liked videos" />
        </Head>
      )}
      {/* Right Side */}
      <div className={GetClassName(style, "right_container", Theme)}>
        <div className={style.main_thumb}>
          <div className={style.thumbnail}>
            <div id="wl-sklt" className={style.imgwrapper}>
              <img
                width="357"
                className={style.imgwrapper__img}
                id="wlv-thumbnail"
                alt=""
              />
            </div>
            <div className={style.inner_bg}>
              <PlaySvg />
              <span className={style.inner_bg__txt}>Play all</span>
            </div>
          </div>

          <div className={style.details}>
            <div className={style.details__title}>
              {SearchValue === "WL" ? (
                <span>Watch later</span>
              ) : (
                <span>Liked videos</span>
              )}
            </div>
            <div className={GetClassName(style, "stat", Theme)}>
              <span>{`${PageData().length} ${
                PageData().length > 1 ? "videos" : "video"
              }`}</span>
              <div className={style.stat__dot}>•</div>
              <span>Updated today</span>
            </div>
            <div className={style.stat}>
              <div className={GetClassName(style, "stat__svg", Theme)}>
                <ShuffleSvg />
              </div>
              <div
                onClick={HandleshowMiniDrop}
                className={GetClassName(style, "stat__svg", Theme)}
              >
                <DotsSvg />
              </div>
              {showRemoveAllDrop && (
                <div
                  onClick={HandleRemoveAll}
                  className={GetClassName(style, "stat__drop", Theme)}
                >
                  <TrashSvg />
                  <span>
                    {PageData().length === 0 ? "List is empty" : "Remove All"}
                  </span>
                </div>
              )}
            </div>
            <div
              style={{ margin: "5px 0" }}
              className={`line line--${ReturnTheme(Theme)}`}
            ></div>
            <div className={style.user_details}>
              <div className={style.userwrap}>
                <img
                  width="48"
                  id="_channel_"
                  className={style.userwrap__img}
                  src=""
                  alt=""
                />
              </div>
              <div id="_name_" className={style.user_details__name}></div>
            </div>
          </div>
        </div>
      </div>
      {/* Left Side */}
      <div className={GetClassName(style, "left_container", Theme)}>
        <div className={style.items_container}>
          <div className={style.bsort}>
            <RippleButton
              onclick={() => {}}
              classname={GetClassName(style, "bsort__btn", Theme)}
            >
              <SortBySvg />
              <span>Sort by</span>
            </RippleButton>
          </div>
          {/* videos container */}
          {PageData().map((wl, index) => {
            return (
              <div key={index}>
                <div className={GetClassName(style, "item_container", Theme)}>
                  <div className={style.drag_area}>
                    <DRSvg />
                  </div>
                  <div className={GetClassName(style, "item_wrap", Theme)}>
                    <div
                      className={style.item_wrap__thumb}
                      onClick={() => HandleLink(wl)}
                    >
                      <img
                        width="120"
                        className={style.item_wrap__img}
                        src={wl.thumbnail}
                        alt=""
                      />

                      <div
                        id={`wl-${wl.videoId}-${index}-duration`}
                        className={style.inner}
                      >
                        {SearchValue !== "WL" && SearchValue !== "LW"
                          ? FetchStat(wl.videoId, index)
                          : HandleDuration(wl.duration)}
                      </div>
                    </div>

                    <div className={style.item_wrap__textarea}>
                      <div className={style.item_details}>
                        <div
                          className={style.item_details__title}
                          onClick={() => HandleLink(wl)}
                        >
                          <span>{TextReducer(wl.title, 56)}</span>
                        </div>

                        <Link to={`/channel/${wl.channelId}`}>
                          <div
                            className={GetClassName(
                              style,
                              "item_details__channel_title",
                              Theme
                            )}
                          >
                            {wl.channelTitle}
                          </div>
                        </Link>
                      </div>
                      <div
                        id={`${index}`}
                        onMouseEnter={() => setCurrentMenuIndex(() => index)}
                        onClick={HandleShowMenudrop}
                        className={GetClassName(style, "dot_svg", Theme)}
                      >
                        <DotsSvg />
                      </div>
                      {/* Drop */}
                      <DropMenu
                        index={index}
                        Theme={Theme}
                        HandleQueueClick={HandleQueueClick}
                        wl={wl}
                        HandleRemoveOne={HandleRemoveOne}
                        HandleMoveUp={HandleMoveUp}
                        HandleMoveDown={HandleMoveDown}
                      />
                    </div>
                  </div>
                </div>
                <div className="wl_line_xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default WLV;
