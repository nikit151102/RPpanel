export interface ReferenceItem {
    id: string;
    label: string;
    iconPath: string;
    command?: () => void;
}

export interface ReferenceConfig {
    references_menu: ReferenceItem[];
    config: any;
    permissions?: string[];
    metadata?: any;
}