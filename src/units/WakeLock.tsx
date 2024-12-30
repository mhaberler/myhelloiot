

import { useWakeLock } from 'react-screen-wake-lock';
export type WakeLockProps = {
    activate?: boolean;
};

const WakeLock: React.FC<WakeLockProps> = ({
    activate = true
}) => {

    const { isSupported, request } = useWakeLock({
    });

    return
    { isSupported && activate ? request() : null };
}

export default WakeLock;