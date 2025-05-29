import Position from "./position";

/**
 * Type implementation for object storing element position and backgorund position
 */

interface BgPos extends Position {
    /** Stores background position of element */
    bg: string
}

export default BgPos;