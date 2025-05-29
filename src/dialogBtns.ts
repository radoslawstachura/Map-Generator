import dialogBtn from "./dialogBtn";

/**
 * Type implementation for buttons array in context menu
 */

interface dialogBtns {
    /** buttons array, indexed with strings */
    [index: string]: dialogBtn;
}

export default dialogBtns;