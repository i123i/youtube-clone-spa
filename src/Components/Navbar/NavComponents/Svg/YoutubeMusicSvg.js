import React, { memo } from "react";
import "./sass/svg_style_scnni.scss";

// SVG path COPIED FROM YOUTUBE

const YouTubeMusicSvg = memo(() => {
  return (
    <div className="ytb_svg">
      <svg className="ytb_svg__wrapper" viewBox="0 0 24 24" focusable={false}>
        <g>
          <circle fill="red" cx="12" cy="12" r="12"></circle>
          <path
            fill="#FFF"
            d="M12 6.278A5.728 5.728 0 0 1 17.722 12 5.728 5.728 0 0 1 12 17.722 5.728 5.728 0 0 1 6.278 12 5.728 5.728 0 0 1 12 6.278zm0-.55A6.272 6.272 0 0 0 5.727 12 6.272 6.272 0 0 0 12 18.273 6.272 6.272 0 0 0 18.273 12 6.272 6.272 0 0 0 12 5.727z"
          ></path>
          <path d="M9.818 15.136l5.318-3.272-5.318-3z" fill="#FFF"></path>
        </g>
      </svg>
    </div>
  );
});

export default YouTubeMusicSvg;
