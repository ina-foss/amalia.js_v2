/**
 * Control bar configuration
 */
export interface ControlBarConfig {
    /**
     * Control label
     */
    label: string;
    /**
     * Control name
     */
    control: string;
    /**
     * Icon name
     */
    icon?: string;
    /**
     * Control position
     */
    zone?: number;
    /**
     * Order index
     */
    order?: number;
    /**
     * Custom data control
     */
    data?: any;
}
