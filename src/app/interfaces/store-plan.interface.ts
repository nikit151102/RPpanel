import { Store } from "./store.interface";

export interface StorePlanInstance {
    id: string;
    dateTime: string;
    beginDateTime: string;
    endDateTime: string;
    number: string;
    storeId: string | null;
    store: Store| null;
    userInstanceId: string| null;
    userInstance: UserInstance| null;
    documentSignatureId: string| null;
    documentSignature: DocumentSignature| null;
    monthPlan: number;
    monthPlanAccountant: number;
    storePlans: StorePlan[];
    storePlansAccountant: StorePlan[];
}

export interface StorePlanInstanceCreateDto {
    dateTime: string;
    beginDateTime: string;
    endDateTime: string;
    number: string;
    storeId: string;
    userInstanceId: string | null;
    documentSignatureId: string | null;
    monthPlan: number;
    monthPlanAccountant: number;
}

export interface StorePlan {
    id: string;
    dateTime: string;
    value: number;
    storePlanType: StorePlanType;
    storePlanInstance: StorePlanInstance;
    storeReportAccountant: Store;
}

export interface StorePlanType {
    id: string;
    code: number;
    fullName: string;
    shortName: string;
}

export interface UserInstance {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    avatarUrl: string;
}

export interface DocumentSignature {
    id:string
    dateTime: string;
    remoteFileInfo: RemoteFileInfo;
    userInstance: UserInstance;
    documentId: string;
    documentType: DocumentType;
    ip: string;
    latitude: number;
    longitude: number;
    system: string;
}

export interface RemoteFileInfo {
    id: string;
    fileName: string;
    size: number;
    extension: string;
    url: string;
}

export interface DocumentType {
    id: string;
    code: number;
    fullName: string;
    shortName: string;
}

export interface FilterRequest {
    filters: Filter[];
    sorts: Sort[];
    page: number;
    pageSize: number;
}

export interface Filter {
    field: string;
    value: any;
    operator: string;
}

export interface Sort {
    field: string;
    direction: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    message: string;
    status: number;
    data: T[];
    breadCrumbs: string[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}