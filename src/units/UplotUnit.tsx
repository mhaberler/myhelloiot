import React from 'react';
import uPlot from 'uplot';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';
import "./UplotUnit.css";

const demoData: uPlot.TypedArray[] = [
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4, 5],
];

const demoOptions = {
    width: 400,
    height: 300,
    scales: {
        x: {
            time: false,
            range: [-0.5, 5.5],
        },
        y: {},
    },
    axes: [{}],
    series: [
        {},
        {
            stroke: 'blue',
        },
    ],
};

export type UplotUnitProps = {
    topic?: string;
    title?: string;
    className?: string;
    options?: uPlot.Options,
    data?: uPlot.AlignedData,
};

const UplotUnit: React.FC<UplotUnitProps> = ({
    className = "myUplot",
    options = demoOptions,
    data = demoData,
}) => {
    return <span className={className}>

        <UplotReact
            options={options}
            data={data}
            onCreate={(chart: any) => {
                console.log("onCreate");
            }}
            onDelete={(chart: any) => {
                console.log("onDelete");
            }} />

    </span>;
}

export default UplotUnit;