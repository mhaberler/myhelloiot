import React, { useState, useRef } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import L from 'leaflet';

import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "./LeafletUnit.css";

import { IClientSubscribeOptions } from "mqtt";
import type { MQTTMessage } from "../mqtt/MQTTProvider";
import { useMQTTSubscribe } from "../mqtt/MQTTHooks";
import { ValueFormat } from "../format/FormatTypes";


export type LeafletUnitProps = {
    topic?: string;
    suboptions?: IClientSubscribeOptions;
    format?: ValueFormat;
    className?: string;
    zoom?: number;
    url?: string;
    attribution?: string;
};

const LeafletUnit: React.FC<LeafletUnitProps> = ({
    topic = "",
    suboptions,
    className = "",
    zoom=1,
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
}) => {

    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [map, setMap] = useState(null);

    const ref = useRef(null);

    useMQTTSubscribe(
        topic,
        ({ message }: MQTTMessage) => {
            const json = JSON.parse(message.toString("utf8"));
            const b = { lat: json?.lat, lng: json?.lon }
            if (b) {
                console.log(b);
                setLocation(b)
                map.setView(b, 13)
            }
        },
        suboptions
    );
    return <span className={className}>

        <MapContainer
            center={location}
            zoom={zoom}
            scrollWheelZoom={true}
            ref={setMap}
            style={{ minHeight: "50vh", minWidth: "30vw" }}
        >
            <TileLayer
                attribution={attribution}
                url={url}
            />
            <Marker position={location}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>

    </span>;

}

export default LeafletUnit;