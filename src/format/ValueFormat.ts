/*
MYHELLOIOT
Copyright (C) 2021 Adrián Romero
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { ValueFormat, NumberValidation, ONOFF, onoffnum } from "./FormatTypes";
import { padsegment } from "../gauge/svgdraw";

export const StringValueFormat = (): ValueFormat => ({
  toDisplay: (b: Buffer) => b.toString(),
  fromDisplay: (s: string) => Buffer.from(s),
  className: () => "",
  next: (b: Buffer) => b,
  prev: (b: Buffer) => b,
});

export const JSONValueFormat = (): ValueFormat => ({
  toDisplay: (b: Buffer) => JSON.stringify(JSON.parse(b.toString()), null, 2),
  className: () => "",
  fromDisplay: (s: string) => Buffer.from(JSON.stringify(JSON.parse(s))),
  next: (b: Buffer) => b,
  prev: (b: Buffer) => b,
});

export const HEXValueFormat = (): ValueFormat => ({
  toDisplay: (b: Buffer) => b.toString("hex"),
  className: () => "",
  fromDisplay: (s: string) => Buffer.from(s, "hex"),
  next: (b: Buffer) => b,
  prev: (b: Buffer) => b,
});

export const Base64ValueFormat = (): ValueFormat => ({
  toDisplay: (b: Buffer) => b.toString("base64"),
  className: () => "",
  fromDisplay: (s: string) => Buffer.from(s, "base64"),
  next: (b: Buffer) => b,
  prev: (b: Buffer) => b,
});

export type SwitchValueFormatProps = {
  onoff?: ONOFF;
};

export const SwitchValueFormat = (
  props?: SwitchValueFormatProps
): ValueFormat => {
  const { onoff } = { onoff: onoffnum, ...props };
  return {
    toDisplay: (b: Buffer) => (onoff.on.equals(b) ? "ON" : "OFF"),
    fromDisplay: (s: string) => (s === "ON" ? onoff.on : onoff.off),
    next: (b: Buffer) => (onoff.on.equals(b) ? onoff.off : onoff.on),
    prev: (b: Buffer) => (onoff.on.equals(b) ? onoff.off : onoff.on),
    className: () => "",
  };
};

const getCharClass: (s?: string) => string = (s) =>
  s ? "[" + s.split("").join("][") + "]" : "";

export type NumberValueFormatOptions = Intl.NumberFormatOptions &
  NumberValidation;

export const NumberValueFormat = (
  options?: NumberValueFormatOptions
): ValueFormat => {
  const locale = navigator.language;
  const intl = new Intl.NumberFormat(locale, options);

  const parts: Intl.NumberFormatPart[] = intl.formatToParts(12345.6);
  const numerals: string[] = new Intl.NumberFormat(locale, {
    useGrouping: false,
  })
    .format(9876543210)
    .split("")
    .reverse();
  const inx = new Map<string, string>(
    numerals.map((d: string, i: number) => [d, i.toString()])
  );
  const group = new RegExp(
    `[${parts.find((d) => d.type === "group")?.value}]`,
    "g"
  );
  const decimal = new RegExp(
    `[${parts.find((d) => d.type === "decimal")?.value}]`
  );
  const currency = new RegExp(
    `[${parts.find((d) => d.type === "currency")?.value}]`
  );
  const unit = new RegExp(
    getCharClass(parts.find((d) => d.type === "unit")?.value)
  );

  const numeral = new RegExp(`[${numerals.join("")}]`, "g");
  const getindex = (d: string): string => inx.get(d) || "";
  const inc = options?.step ?? 1;
  const pad = padsegment(
    options?.min ?? Number.MIN_SAFE_INTEGER,
    options?.max ?? Number.MAX_SAFE_INTEGER
  );

  return {
    toDisplay: (b: Buffer) => {
      const s = b.toString();
      return s ? intl.format(Number(s)) : "";
    },
    fromDisplay: (s: string) => {
      const strans = s
        .trim()
        .replace(group, "")
        .replace(currency, "")
        .replace(unit, "")
        .replace(decimal, ".")
        .replace(numeral, getindex);
      //we need to replace also currency and units

      return Buffer.from(strans);
    },
    next: (b: Buffer) =>
      Buffer.from(pad(Number(b.toString()) + inc).toString()),
    prev: (b: Buffer) =>
      Buffer.from(pad(Number(b.toString()) - inc).toString()),
    className: () => "myhToIconFormat_alignright",
  };
};
