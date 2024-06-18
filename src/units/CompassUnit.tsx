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


import React, { useEffect, useState } from 'react';

import './CompassUnit.css';
import 'normalize.css';

interface ContainerProps {
    directionNames?: string[]
}


const CompassUnit: React.FC<ContainerProps> = ({ directionNames = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'] }) => {

    const [compass, setCompass] = useState(0);

    useEffect(() => {
        start()
    }, []);

    const start = async () => {
        // https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi
        window.addEventListener("deviceorientationabsolute", onOrientationEventAbsolute, true);
        function onOrientationEventAbsolute(event: any) {
            const compass = Math.abs(event.alpha - 360);
            setCompass(compass)
        }
    }

    const formatDirection = (dir: number) => {
        return Number(Number(dir).toFixed(0))
    }

    const directionName = (dir: any) => {
        const sections = directionNames.length
        const sect = 360 / sections
        let x = Math.floor((dir + sect / 2) / sect)
        x = x >= sections ? 0 : x;

        return directionNames[x];
    }

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
