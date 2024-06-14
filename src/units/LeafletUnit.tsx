import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import "leaflet/dist/leaflet.css";
import "./LeafletUnit.css";

export type LeafletUnitProps = {
    topic?: string;
    title?: string;
    className?: string;
};

const LeafletUnit: React.FC<LeafletUnitProps> = ({
    className = "myLeaflet",
}) => {
    return <span className={className}>

        <MapContainer
            center={[47.12830680003528, 15.210969020512545]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ minHeight: "50vh", minWidth: "30vw" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[47.12830680003528, 15.210969020512545]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>

    </span>;

}

export default LeafletUnit;