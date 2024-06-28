import React, { useState } from 'react';
import { MapContainer, TileLayer, ScaleControl, useMapEvent, Marker, Popup } from 'react-leaflet';

import "leaflet/dist/leaflet.css";
import "./LeafletUnit.css";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { IClientSubscribeOptions } from "mqtt";
import type { MQTTMessage } from "../mqtt/MQTTProvider";
import { useMQTTSubscribe } from "../mqtt/MQTTHooks";
import { ValueFormat } from "../format/FormatTypes";
import L from 'leaflet';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina
});

L.Marker.prototype.options.icon = DefaultIcon;

export type LeafletUnitProps = {
    topic?: string;
    suboptions?: IClientSubscribeOptions;
    format?: ValueFormat;
    className?: string;
    zoom?: number;
    zoomOnFix?: number;
    url?: string;
    attribution?: string;
};

const LeafletUnit: React.FC<LeafletUnitProps> = ({
    topic = "",
    suboptions,
    className = "",
    zoom = 1,
    zoomOnFix = 13,
    attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
}) => {

    const [location, setLocation] = useState({ lat: 0, lng: 0 });

    useMQTTSubscribe(
        topic,
        ({ message }: MQTTMessage) => {
            const json = JSON.parse(message.toString("utf8"));
            const b = { lat: json?.lat, lng: json?.lon }
            if (b) {
                setLocation(b)
            }
        },
        suboptions
    ); 

    function ReCenter() {
        const map = useMapEvent('click', () => {
            map.setView(location, zoomOnFix) // map.getZoom())
        })
        return null
    }

    return <span className={className}>
        <MapContainer
            center={location}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ minHeight: "50vh", minWidth: "30vw" }}
        >
            <ReCenter />
            <TileLayer
                attribution={attribution}
                url={url}
            />
            <ScaleControl imperial={false} />

            <Marker position={location}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    </span>;

}

export default LeafletUnit;