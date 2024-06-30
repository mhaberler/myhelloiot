import React, { useState } from 'react';
import UplotReact from 'uplot-react';
import { IClientSubscribeOptions } from "mqtt";
import type { MQTTMessage } from "../mqtt/MQTTProvider";
import { useMQTTSubscribe } from "../mqtt/MQTTHooks";
import { ConvertBuffer, IdentityConvert } from "../format/ConvertTypes";
import { debugLog } from "../debug";

import 'uplot/dist/uPlot.min.css';
import "./UplotUnit.css";

// type PlotValue = (number | null | undefined);
type DataArray = (number | null | undefined)[];

const demoOptions = {
    title: 'Plot',
    width: 400,
    height: 200,
    scales: {
        x: { time: true },
        y: { auto: true }
    },
    series: [
        {},
        {
            label: 'Data',
            stroke: 'blue',
            fill: 'rgba(0, 0, 255, 0.1)',
        }
    ],
};


export type UplotUnitProps = {
    subtopic?: string;
    suboptions?: IClientSubscribeOptions;
    subconvert?: ConvertBuffer;
    title?: string;
    className?: string;
    options?: uPlot.Options,
    xaxis?: string;
    windowsize?: number,
    // data?: any
    // options?: uPlot.Options,
    //  data?: uPlot.AlignedData,
};

const UplotUnit: React.FC<UplotUnitProps> = ({
    subtopic = "",
    suboptions,
    subconvert = IdentityConvert(),
    xaxis = "RelativeSec",
    windowsize = 100, // Maximum number of data points in the window
    options = demoOptions,
    className,
}) => {
    // const [data, setData] = useState<uPlot.AlignedData>([[], [], [], [], []]);
    const [data, setData] = useState<uPlot.AlignedData>([[]]);
    // const [plotData, setPlotData] = useState<uPlot.AlignedData>();

    let t_offset = 0;
    let t_factor = 1;

    // how to interpret data[0]
    //     Value  // just a value, not a timestamp
    //     Epoch  // a Unix timestamp, secs since 1-1-1970
    //     RelativeMsec // mSec since device boot
    //     RelativeSec  // seconds since device boot

    switch (xaxis) {
        case "Value":
            options!.scales!.x!.time = false;
            break;
        case "RelativeMsec":
            options!.scales!.x!.time = true;
            t_offset = new Date().getTime() / 1000.0;
            t_factor = 1;
            break;
        case "RelativeSec":
            options!.scales!.x!.time = true;
            t_offset = new Date().getTime() / 1000.0;
            t_factor = 0.001;
            break;
        case "Epoch":
        default:
            options!.scales!.x!.time = true;
    }

    useMQTTSubscribe(
        subtopic,
        ({ message }: MQTTMessage) => {
            // expects an array of len >= 2
            // array[0] = timestamp
            // array[1..n] = plotData samples (null for missing values)
            const b = subconvert(message);
            if (!b)
                return;
            // @ts-ignore 
            setData(prevData => {
                let data: DataArray = [];
                try {
                    data = JSON.parse(b.toString());
                } catch (error) {
                    debugLog(error);
                    return;
                }
                if (!Array.isArray(data) || data.length < 2) {
                    return
                }
                const newData: uPlot.AlignedData = [];
                // @ts-ignore 
                const newX = data[0] * t_factor + t_offset;

                // Keep only the latest windowsize time points
                // @ts-ignore 
                newData.push([...prevData[0], newX].slice(-windowsize));

                for (let i = 1; i < data.length; i++) {
                    // Keep only the latest windowsize data points

                    // @ts-ignore 
                    newData.push([...prevData[i], data[i]].slice(-windowsize));
                }
                return newData;
            });

        },
        suboptions
    );

    return <span className={className}>

        <UplotReact
            options={options}
            data={data}
            onCreate={(chart) => {
                debugLog('Chart created:', chart);
            }}
            onDelete={(chart) => {
                debugLog('Chart deleted:', chart);
            }} />

    </span>;
}

export default UplotUnit;