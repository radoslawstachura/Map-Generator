
/**
 * Type implementation of button in context menu
 */

interface dialogBtn {
    /** Stores text displayed in button */
    text: string;
    /** Stores key code for event listener */
    key: string;
    /** Callback which listener invokes */
    callback: Function;
}

export default dialogBtn;