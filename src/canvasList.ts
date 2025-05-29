/**
 * Type implementation for array of map squares DOM elements
 */

interface CanvasList extends Array<HTMLCanvasElement> {
    /** Array of map elements indexed with numbers */
    [index: number]: HTMLCanvasElement
}

export default CanvasList;