// Protocol types shared between server and clients
interface LoginData {
    id: number;
    name: string;
}

interface PositionData {
    x: number;
    y: number;
}

interface PlayerInfo {
    id: number;
    name: string;
    x: number;
    y: number;
}

interface Packet<T = unknown> {
    type: string;
    data: T;
}

// Internal server-side player record (includes isDirty flag)
interface PlayerData {
    id: number;
    name: string;
    x: number;
    y: number;
    isDirty: boolean;
}


