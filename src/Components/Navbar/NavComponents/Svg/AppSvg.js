import React, { useState, useContext } from "react";
import "./sass/svg_style_scnni.scss";
import { ThemeContext } from "../../../../Context";
import { ReturnTheme } from "../../../../utils";

// SVG path COPIED FROM YOUTUBE

const AppSvg = React.memo(() => {
  const [fade, setFade] = useState(false);

  const [YtTheme] = useContext(ThemeContext);
  const Theme = YtTheme.isDarkTheme;

  const HundleClick = () => {
    setFade(true);
    setTimeout(() => {
      setFade(false);
    }, 300);
  };

  return (
    <button
      id="apx"
      className={`ytb_svg titleA titleA--${ReturnTheme(Theme)}`}
      onClick={HundleClick}
    >
      <svg className="ytb_svg__wrapper" viewBox="0 0 24 24" focusable={false}>
        <g>
          <path
            fill={Theme ? "#fff" : "#606060"}
            d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"
          ></path>
        </g>
      </svg>
      <div
        className={`ytb_svg__effect ${
          fade ? `ytb_svg__action--${ReturnTheme(Theme)}` : ""
        }`}
      ></div>
    </button>
  );
});

export default AppSvg;
