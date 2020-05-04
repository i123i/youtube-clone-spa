import React, { useContext } from "react";
import "./sass/drop_style.scss";
import { UploadSvg, GoLiveSvg } from "../Svg";
import { ThemeContext } from "../../../../Context";
import { ReturnTheme } from "../../../../utils";
import { LazyLoad } from "../../../ComponentsUtils";
// Using Memo to prevent unnecessary re-renders

const CamDrop = React.memo(({ show }) => {
  // Theme context
  const [YtTheme] = useContext(ThemeContext);
  const Theme = YtTheme.isDarkTheme;

  const app_text = `nav_drop_container__text nav_drop_container__text--${ReturnTheme(
    Theme
  )}`;

  return (
    <div
      style={{ display: show ? "" : "none" }}
      className={`nav_drop_container position--cam_drop nav_drop_container--${ReturnTheme(
        Theme
      )}`}
    >
      <LazyLoad render={show}>
        <a
          href="https://studio.youtube.com/channel/"
          target="_blank"
          rel="noopener noreferrer"
          className={app_text}
        >
          <div className="icon_wrap">
            <UploadSvg />
          </div>
          <div className="text_wrap">Upload video</div>
        </a>
        <a
          href="https://studio.youtube.com/channel/"
          target="_blank"
          rel="noopener noreferrer"
          className={app_text}
        >
          <div className="icon_wrap">
            <GoLiveSvg />
          </div>
          <div className="text_wrap">Go live</div>
        </a>
      </LazyLoad>
    </div>
  );
});

export default CamDrop;
