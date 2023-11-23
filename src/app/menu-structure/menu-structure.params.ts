export interface UploadParam {
    table: string,
    fileMenuInfo: any,
    fileModulUrlInfo: any,
    menuListVariableName: string,
    modulUrlListVariableName: string,
}

export interface ModulUrlInfo {
    modulId: string,
    url: string,
    icon?: string,
    variable?: string
};

export interface MenuInfo {
    menuId: string;
    menuSequence: string;
    icon?: string;
    url?: string;
    variable?: string;
}