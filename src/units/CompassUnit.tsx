/**
 * This code has refactored from the following code:
 * 
 * ReactCompass - a carefully crafted Compass component for React.
 * https://github.com/virtyaluk/react-compass
 *
 * Copyright (c) 2016 Bohdan Shtepan
 * http://modern-dev.com/
 *
 * Licensed under the MIT license.
 *
 * @flow
 */


import React, { useState } from 'react';
import { IClientSubscribeOptions } from "mqtt";
import type { MQTTMessage } from "../mqtt/MQTTProvider";
import { useMQTTSubscribe } from "../mqtt/MQTTHooks";
import { ValueFormat } from "../format/FormatTypes";
import { ConvertBuffer, IdentityConvert } from "../format/ConvertTypes";

import './CompassUnit.css';
import 'normalize.css';

interface CompassUnitPropos {
    directionNames?: string[],
    subtopic?: string;
    suboptions?: IClientSubscribeOptions;
    subconvert?: ConvertBuffer;
    format?: ValueFormat;
    // duration?: number;
    // className?: string;
}

const CompassUnit: React.FC<CompassUnitPropos> = ({
    directionNames = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
    subtopic = "",
    suboptions,
    subconvert = IdentityConvert(),
    //  className,
}) => {

    const [compass, setCompass] = useState(0);

    useMQTTSubscribe(
        subtopic,
        ({ message }: MQTTMessage) => {
            try {
                const s = subconvert(message)?.toString();
                if (s) {
                    setCompass(parseFloat(s));
                }
            }
            catch (err) {
                console.log(err)
            }
        },
        suboptions
    );

    const formatDirection = (dir: number) => {
        return Number(Number(dir).toFixed(0))
    }

    const directionName = (dir: number) => {
        const sections = directionNames.length
        const sect = 360 / sections
        let x = Math.floor((dir + sect / 2) / sect)
        x = x >= sections ? 0 : x;

        return directionNames[x];
    }
    // className={`myhLogView ${className}`}

    return (
        <div className="center compass" >
            <div className="compass__windrose"
                style={{ transform: `rotate(-${compass}deg)` }}>
                {[...Array(10)].map((k, i) => <div className="compass__mark" key={i + 1}></div>)}
                <div className="compass__mark--direction-h"></div>
                <div className="compass__mark--direction-v"></div>
            </div>
            <div className="compass__arrow-container">
                <div className="compass__arrow"></div>
                <div className="compass__labels">
                    <span></span>

                </div>
            </div>
            <div className="degrees">
                <span>{formatDirection(compass)}<sup>o</sup></span> <span>{directionName(formatDirection(compass))}</span>
            </div>
        </div>
    );
}

export default CompassUnit;
