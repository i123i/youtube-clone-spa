import React, { memo } from "react";
import "./sass/svg_style_scnni.scss";

// SVG path COPIED FROM YOUTUBE

const SASvg = memo(() => {
  return (
    <div className="ytb_svg">
      <svg className="ytb_svg__wrapper" viewBox="0 0 24 24" focusable={false}>
        <g>
          <path
            fill="#909090"
            d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12zm-3 5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-9 8v1h12v-1c0-2-4-3.1-6-3.1S8 13 8 15z"
          ></path>
        </g>
      </svg>
    </div>
  );
});

export default SASvg;
