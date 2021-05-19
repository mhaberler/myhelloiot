import React from "react";
import { padvalue } from "./svgdraw";
import "./LiquidGauge.css";

export type LiquidGaugeProps = {
  value?: number;
  valueformat?: Intl.NumberFormatOptions;
  title?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
};

const LiquidGauge: React.FC<LiquidGaugeProps> = ({
  value,
  valueformat,
  title = "",
  className = "",
  min = 0,
  max = 100,
}) => {
  const locale = navigator.language;
  const intlvalue = new Intl.NumberFormat(locale, valueformat);

  const r1 = 55;
  const r2 = 52;
  const centerx = 100;
  const centery = 60;

  let yvalue: number;
  let formatvalue: string;
  if (typeof value === "undefined" || isNaN(value)) {
    yvalue = 0;
    formatvalue = "";
  } else {
    yvalue = padvalue(min, max, r2 * 2)(value);
    formatvalue = intlvalue.format(value);
  }

  yvalue = centery + r2 - yvalue;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 200 130"
      className={className}
    >
      <defs>
        <clipPath id="cut-off-bottom">
          <rect
            className="liquid-indicator-bar"
            x={0}
            y={yvalue}
            width={200}
            height={130}
            style={{
              transition: "y 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s",
            }}
          />
        </clipPath>
      </defs>
      <circle
        cx={centerx}
        cy={centery}
        r={r1}
        className="liquid-indicator-border"
      />

      <text
        x={100}
        y={60}
        textAnchor="middle"
        className="liquid-indicator-value"
      >
        {formatvalue}
      </text>
      <text
        x={100}
        y={80}
        textAnchor="middle"
        className="liquid-indicator-title"
      >
        {title}
      </text>

      <circle
        cx={centerx}
        cy={centery}
        r={r2}
        className="liquid-indicator-background"
        clip-path="url(#cut-off-bottom)"
      />

      <text
        id="value2"
        x={100}
        y={60}
        textAnchor="middle"
        className="liquid-indicator-value2"
        clip-path="url(#cut-off-bottom)"
      >
        {formatvalue}
      </text>
      <text
        id="title2"
        x={100}
        y={80}
        textAnchor="middle"
        className="liquid-indicator-title2"
        clip-path="url(#cut-off-bottom)"
      >
        {title}
      </text>
    </svg>
  );
};

export default LiquidGauge;
