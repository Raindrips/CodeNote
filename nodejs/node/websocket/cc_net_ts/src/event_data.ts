export enum ServerEventOld {
    LOGIN_SUCCESS,
    PLAYER_LEAVE,
    PLAYER_LIST,
    PLAYER_ENTER,
    SYNC_POS,
}

export const ClientEvent = {
    LOGIN: 'LOGIN',
    UPDATE_POS: 'UPDATE_POS',
} as const;

export type ClientEvent = (typeof ClientEvent)[keyof typeof ClientEvent];

export const ServerEvent = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    PLAYER_LEAVE: 'PLAYER_LEAVE',
    PLAYER_LIST: 'PLAYER_LIST',
    PLAYER_ENTER: 'PLAYER_ENTER',
    SYNC_POS: 'SYNC_POS',
} as const;

export type ServerEvent = (typeof ServerEvent)[keyof typeof ServerEvent];
