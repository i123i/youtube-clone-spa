import React, { useState, useCallback, memo } from "react";
import style from "./sass/rv.module.scss";
import { Link, useHistory } from "react-router-dom";
import { DotsSvg } from "../Navbar/NavComponents/Svg";
import {
  TextReducer,
  ViewsNumFormatter,
  HandleDuration,
  GetClassName,
} from "../../utils";
import Moment from "react-moment";
import { TimeSvg, QueueSvg, CheckedSvg } from "./Svg";
import { useSelector, useDispatch } from "react-redux";
import {
  RemoveOneQueueAction,
  ADDInQueueAction,
  ShowQueueAction,
  Wl_RemoveOneAtion,
  Wl_AddAction,
  HideQueueAction,
  CloseMessageAction,
  SetMessageAction,
  PlayQueueAction,
  HideGuideAction,
  SetGuideModeAction,
  SetUrlLocationAction,
} from "../../redux";
import { useFetch } from "../hooks/useFetch";

const ResultVideoContainer = memo(({ item, index, HandleShowMessageBox }) => {
  // Theme
  const Theme = useSelector((state) => state.Theme.isDarkTheme);

  // WLV
  const WatchLater = useSelector((state) => state.WLV.WL);

  // Queue
  const ShowQueue = useSelector((state) => state.DisplayQueue);
  const QueueList = useSelector((state) => state.QueueList);

  // dispatch
  const dispatch = useDispatch();

  //
  let history = useHistory();

  // ======================================
  // Check if a video is already in wl list
  // ======================================

  const [IswatchLater, setIsWatchLater] = useState(
    WatchLater.some((wl) => wl.videoId === item.videoId)
  );

  // =========================================
  // Check if a video is already in queue list
  // =========================================
  const [IsQueue, setIsQueue] = useState(
    QueueList.some((que) => que.videoId === item.videoId)
  );

  // =================================
  //  Fetch video duration and viewer
  // =================================

  const snippet = useFetch(item.videoId, "videos", "contentDetails,statistics");

  const Fetch_Data = (id, index) => {
    if (Object.keys(snippet).length !== 0) {
      const durationIdElement = document.getElementById(
        `${id}-${index}-duration`
      );

      const viewCountIdElement = document.getElementById(
        `${id}-${index}-viewcount`
      );

      if (durationIdElement) {
        durationIdElement.textContent = HandleDuration(
          snippet.contentDetails.duration
        );
      }

      if (viewCountIdElement) {
        viewCountIdElement.textContent = `${ViewsNumFormatter(
          snippet.statistics.viewCount
        )} views`;
      }
    }
  };

  // =========================
  //  Handle Watch Later btn
  // =========================

  const HandleWLClick = useCallback(
    (
      title,
      duration,
      videoId,
      channelTitle,
      channelId,
      thumbnail,
      IswatchLater_
    ) => {
      setIsWatchLater(!IswatchLater);
      HandleShowMessageBox("wl", IswatchLater, item.videoId);

      if (IswatchLater_) {
        dispatch(Wl_RemoveOneAtion(videoId));
      } else {
        dispatch(
          Wl_AddAction({
            title,
            duration,
            videoId,
            channelTitle,
            channelId,
            thumbnail,
          })
        );
      }
    },
    [IswatchLater, HandleShowMessageBox, item, dispatch]
  );

  // =========================
  //    Handle Queue btn
  // =========================

  const HandleQueueClick = useCallback(
    (
      title,
      duration,
      videoId,
      channelTitle,
      channelId,
      thumbnail,
      IsQueue_
    ) => {
      setIsQueue(!IsQueue);

      if (!ShowQueue) {
        dispatch(ShowQueueAction());
      }

      const playing = QueueList.length === 0;

      if (IsQueue_) {
        dispatch(RemoveOneQueueAction(videoId));

        // --- MessageBox

        if (QueueList.length - 1 === 0 && ShowQueue) {
          dispatch(HideQueueAction());

          dispatch(
            SetMessageAction({
              message: "Close Queue",
              btnText: "",
              from: "queue",
              id: "",
            })
          );
          setTimeout(() => {
            dispatch(CloseMessageAction());
          }, 2000);
        } else {
          dispatch(
            SetMessageAction({
              message: "Removed from Queue",
              btnText: "",
              from: "queue",
              id: "",
            })
          );
          setTimeout(() => {
            dispatch(CloseMessageAction());
          }, 2000);
        }
      } else {
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

        // --- MessageBox

        dispatch(
          SetMessageAction({
            message: "Video added to queue",
            btnText: "",
            from: "queue",
            id: "",
          })
        );
        setTimeout(() => {
          dispatch(CloseMessageAction());
        }, 2000);
      }
    },
    [IsQueue, QueueList, dispatch, ShowQueue]
  );

  const HandleRImg = useCallback((skeleton_id, index) => {
    // BackgroundColor can be red and you can use it as video duration with the width.

    const imgTIdElement = document.getElementById(`${skeleton_id}-${index}`);
    if (imgTIdElement) {
      imgTIdElement.style.backgroundColor = "transparent";
      imgTIdElement.style.height = "auto";
    }
  }, []);

  // ======================
  //  redirect with params
  // ======================

  const HandleLink = useCallback(() => {
    if (ShowQueue) {
      const exist = QueueList.filter((obj) => {
        return obj.videoId === item.videoId;
      });

      if (exist.length === 0) {
        HandleQueueClick(
          item.title,
          snippet.contentDetails.duration,
          item.videoId,
          item.channelTitle,
          item.channelId,
          item.thumbnail
        );
        dispatch(PlayQueueAction(item.videoId));
      }
    } else {
      // for a smooth guide transition
      dispatch(HideGuideAction());
      dispatch(SetGuideModeAction(2));
      dispatch(SetUrlLocationAction("watch"));
      history.push(`/watch?v=${item.videoId}`);
    }
  }, [
    item,
    history,
    snippet,
    HandleQueueClick,
    ShowQueue,
    dispatch,
    QueueList,
  ]);

  // Slider HandleHoverIn

  const HandleHoverIn = (value) => {
    const slider = document.getElementById(`slider-${value}-${index}`);

    if (slider) {
      slider.style.position = "relative";
      slider.style.zIndex = "1";
      slider.style.transform = "translateX(0px)";
    }
  };

  // Slider HandleHoverOut

  const HandleHoverOut = (value) => {
    const slider = document.getElementById(`slider-${value}-${index}`);

    if (slider) {
      slider.style.zIndex = "0";
      slider.style.transform = "translateX(135px)";
      setTimeout(() => {
        slider.style.position = "absolute";
        // Note: transition: transform 0.35s ease-in-out;
      }, 350);
    }
  };

  return (
    <div className={style.item_section}>
      <div className={style.item_wrap}>
        <div className={style.thumbnail}>
          <div onClick={HandleLink} className={style.video}>
            <div
              id={`hresultCha-${index}`}
              className={GetClassName(style, "vid_thumb", Theme)}
            >
              <img
                onLoad={() => HandleRImg("hresultCha", index)}
                src={item.thumbnail}
                alt=""
                className={style.vid_thumb__img}
              />
            </div>
          </div>
          {/* -------------head svg-------------- */}
          <div
            id={`${item.videoId}-${index}-duration`}
            className={`${style.inner_btn} ${style["inner_btn--duration"]}`}
          >
            {Fetch_Data(item.videoId, index)}
          </div>
          <button
            onClick={() =>
              HandleWLClick(
                item.title,
                document.getElementById(`${item.videoId}-${index}-duration`)
                  .innerHTML,
                item.videoId,
                item.channelTitle,
                item.channelId,
                item.thumbnail,
                IswatchLater
              )
            }
            className={`${style.inner_btn} ${style["inner_btn--clock"]}`}
          >
            <div
              onMouseEnter={() => HandleHoverIn("wl")}
              onMouseLeave={() => HandleHoverOut("wl")}
              className={style.icon_btn}
            >
              {IswatchLater ? (
                <div className={style.icon_btn__check}>
                  <CheckedSvg />
                </div>
              ) : (
                <TimeSvg />
              )}
            </div>
            <div id={`slider-wl-${index}`} className={style.slider}>
              {IswatchLater ? (
                <div className={style.slider__check}>added</div>
              ) : (
                <div className={style.slider__normal}>watch later</div>
              )}
            </div>
          </button>
          <button
            onClick={() =>
              HandleQueueClick(
                item.title,
                document.getElementById(`${item.videoId}-${index}-duration`)
                  .innerHTML,
                item.videoId,
                item.channelTitle,
                item.channelId,
                item.thumbnail,
                IsQueue
              )
            }
            className={`${style.inner_btn} ${style["inner_btn--queue"]}`}
          >
            <div
              onMouseEnter={() => HandleHoverIn("q")}
              onMouseLeave={() => HandleHoverOut("q")}
              className={style.icon_btn}
            >
              {IsQueue ? <CheckedSvg /> : <QueueSvg />}
            </div>
            <div id={`slider-q-${index}`} className={style.slider}>
              {IsQueue ? (
                <div className={style.slider__check}>added</div>
              ) : (
                <div className={style.slider__text}>add to queue</div>
              )}
            </div>
          </button>
          {/* -------------body-------------- */}
        </div>
        <div className={style.body}>
          <div className={style.body__container}>
            <div className={style.body__text_wrap}>
              <div className={style.results_header}>
                <div
                  onClick={HandleLink}
                  className={GetClassName(
                    style,
                    "results_header__title",
                    Theme
                  )}
                >
                  {TextReducer(item.title, 56)}
                </div>
              </div>
              <div className={GetClassName(style, "details", Theme)}>
                <Link
                  data-scontent={item.channelTitle}
                  className={GetClassName(style, "details__ch_title", Theme)}
                  to={`/channel/${item.channelId}`}
                >
                  {item.channelTitle}
                </Link>
                <div className={style.details__ch_dot}>•</div>
                <div className={style.details__sv_tt}>
                  <span id={`${item.videoId}-${index}-viewcount`}></span>
                  <div className={style.details__ch_dot}>•</div>
                  <span>
                    <Moment fromNow>{item.publishedAt}</Moment>
                  </span>
                </div>
              </div>
            </div>
            <div
              className={GetClassName(style, "body__container__menu", Theme)}
            >
              <DotsSvg />
            </div>
          </div>
          <div className={GetClassName(style, "item_wrap__details", Theme)}>
            {TextReducer(item.description, 121)}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ResultVideoContainer;
