import React from "react";
import "../../Navbar/NavComponents/Svg/svg_style_scnni.scss";

// SVG path COPIED FROM YOUTUBE

const PrevBtnSvg = React.memo(() => {
  return (
    <div className="icon_container">
      <svg className="icon_" viewBox="0 0 36 36" focusable={false}>
        <g>
          <path
            className="fill"
            fill="#fff"
            d="m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z"
          ></path>
        </g>
      </svg>
    </div>
  );
});

export default PrevBtnSvg;