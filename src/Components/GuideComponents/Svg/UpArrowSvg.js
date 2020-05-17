import React, { memo } from "react";
import "../../Navbar/NavComponents/Svg/sass/svg_style_scnni.scss";
import { useSelector } from "react-redux";

// SVG path COPIED FROM YOUTUBE

const UpArrowSvg = memo(() => {
  // Theme
  const Theme = useSelector((state) => state.Theme.isDarkTheme);

  return (
    <div className="ytb_svg">
      <svg className="ytb_svg__wrapper" viewBox="0 0 24 24" focusable={false}>
        <g>
          <path
            fill={Theme ? "#909090" : "#606060"}
            d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
          ></path>
        </g>
      </svg>
    </div>
  );
});

export default UpArrowSvg;
