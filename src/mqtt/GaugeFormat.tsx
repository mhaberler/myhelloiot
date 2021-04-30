import React from "react";
import { IconFormat, NumberValidation } from "./FormatTypes";
import LinearGauge from "../gauge/LinearGauge";
import DashboardGauge from "../gauge/DashboardGauge";
import SimpleGauge from "../gauge/SimpleGauge";

export const LinearIconFormat: (
  validation: NumberValidation,
  valueformat?: Intl.NumberFormatOptions
) => IconFormat = (validation, valueformat) => ({
  toIcon: (buffer) => (
    <LinearGauge
      min={validation.min}
      max={validation.max}
      step={validation.step}
      value={Number(buffer.toString())}
      valueformat={valueformat}
    />
  ),
});

export const DashboardIconFormat: (
  validation: NumberValidation,
  valueformat?: Intl.NumberFormatOptions
) => IconFormat = (validation, valueformat) => ({
  toIcon: (buffer) => (
    <DashboardGauge
      value={Number(buffer.toString())}
      valueformat={valueformat}
      min={validation.min}
      max={validation.max}
    />
  ),
});

export const SimpleIconFormat: (
  validation: NumberValidation,
  valueformat?: Intl.NumberFormatOptions
) => IconFormat = (validation, valueformat) => ({
  toIcon: (buffer) => (
    <SimpleGauge
      value={Number(buffer.toString())}
      valueformat={valueformat}
      min={validation.min}
      max={validation.max}
    />
  ),
});