
import Compass from 'react-compass-component/src'

// import Compass from 'react-compass';
// import 'react-compass/dist/react-compass.css';


export type CompassUnitProps = {
    topic?: string;
    title?: string;
    className?: string;
};

//         {/* <Compass directionNames={['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']} */}

const CompassUnit: React.FC<CompassUnitProps> = ({
    className = "myCompass",
}) => {
    return <span className={className}>
        <Compass

            />
    </span>;
}

export default CompassUnit;
