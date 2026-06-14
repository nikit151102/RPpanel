export interface WorkingHour {
    id: string;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    storeScheduleId?: string;
}

export interface WorkingHourCreateDto {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
}

export interface ExceptionDay {
    id: string;
    date: string;
    isClosed: boolean;
    openTime: string;
    closeTime: string;
    storeId: string;
}

export interface ExceptionDayCreateDto {
    date: string;
    isClosed: boolean;
    openTime: string;
    closeTime: string;
    storeId: string;
}

export interface StoreSchedule {
    id: string;
    storeId: string;
}

export interface StoreScheduleCreateDto {
    storeId: string;
}