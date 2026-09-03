export interface TimelineLocalisation {
    label: string;
    type: string;
    thumb: string;
    tc: number;
    tcIn: number;
    tcOut: number;
    color?: string;
};

export interface TimeLineBlock {
    id?: string,
    label?: string,
    expendable: boolean,
    defaultColor?: string,
    displayState: boolean,
    data: Array<TimelineLocalisation>,
    icon?: string
};
