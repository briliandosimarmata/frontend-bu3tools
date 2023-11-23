import { MenuStructure } from "./menu-structure";
import { MenuInfo, ModulUrlInfo } from "./menu-structure.params";

export const readModulUrlData = (content: string, key: string) => {
    let resModulUrls: ModulUrlInfo[] = [];

    //remove all comment
    content = content.replace(/(\/\/).*?(\n)/g, '\n');

    //remove all space and tabs
    content = content.replace(/\r|\s+|\n/g, '');

    //give space per variable declaration
    content = content.replace(/exportinterface|interface/g, '\ninterface ');
    content = content.replace(/exportconst|const/g, '\nconst ');
    content = content.replace(/exportlet|let/g, '\nlet ');
    content = content.replace(/exportvar|var/g, '\nvar ');

    //match character begin the key until '=[' and end with ']\n' or last ']'
    let regexForFindModulUrlArrContent = new RegExp(`(?:${key}.*?\\=\\[)(.*?)(?:\\]\n|\\]|\\]\\;|\\]\\;\n)$`);
    let modulUrlArrContent = content.match(regexForFindModulUrlArrContent)?.[1];

    //keluarkan semua array dan replace double comma dengan satu comma
    modulUrlArrContent = modulUrlArrContent
        ?.replace(/\.\.\.\[|]/g, '')
        .replace(/\,+/g, ',');

    //ambil semua isi dari object literal dalam array modul url
    //Output: modulId: '', url: ''
    modulUrlArrContent?.match(/(?<=\{).*?(?=\})/g)?.forEach(
        (modulUrl) => {

            let resModulUrl: ModulUrlInfo = {
                modulId: '',
                url: ''
            };

            modulUrl.split(',').forEach(
                (modulUrlVal) => {
                    if (modulUrlVal.trim().length > 0) {
                        let modulUrlValSet = modulUrlVal.split(':');

                        for (const keyResModulUrl in resModulUrl) {
                            if (keyResModulUrl === modulUrlValSet[0].replace(/\"|\'/g, '')) {
                                resModulUrl[keyResModulUrl as keyof typeof resModulUrl] =
                                    modulUrlValSet[1].replace(/\"|\'/g, '');
                            }
                        }
                    }
                }
            )

            resModulUrls = [...resModulUrls, resModulUrl];
        }
    )

    // erase literal modul object
    modulUrlArrContent = modulUrlArrContent?.replace(/\{(.*?)\}/g, '').replace(/\,+/g, ',');

    //get variable object value in array modul url if exist
    modulUrlArrContent?.split(',').forEach(
        (modulUrlVar) => {
            if (modulUrlVar.trim().length > 0) {

                //handle if there are array variable in modul url array with spread operator
                if (modulUrlVar.search(/\.\.\./) != -1) {
                    //handle later when cases found
                } else {
                    let resModulUrl: ModulUrlInfo = {
                        modulId: '',
                        url: ''
                    };

                    let regexForFindVarObjVal =
                        new RegExp(`(?:${modulUrlVar}.*?\\=\\{)(.*?)(?:\\})`);

                    content.match(regexForFindVarObjVal)?.[1].split(',').forEach(
                        (modulUrlVal) => {
                            if (modulUrlVal.trim().length > 0) {
                                let modulUrlValSet = modulUrlVal.split(':');

                                for (const keyResModulUrl in resModulUrl) {
                                    if (keyResModulUrl === modulUrlValSet[0].replace(/\"|\'/g, '')) {
                                        resModulUrl[keyResModulUrl as keyof typeof resModulUrl] =
                                            modulUrlValSet[1].replace(/\"|\'/g, '');
                                    }
                                }
                            }
                        }
                    );

                    resModulUrls = [...resModulUrls, resModulUrl];
                }
            }
        }
    );

    return resModulUrls;
}

export const readMenuData = (content: string, key: string) => {
    let resMenus: MenuInfo[] = [];

    //remove all comment
    content = content.replace(/(\/\/).*?(\n)/g, '\n');

    //remove all space and tabs
    content = content.replace(/\r|\s+|\n/g, '');

    //give space per variable declaration
    content = content.replace(/exportinterface|interface/g, '\ninterface ');
    content = content.replace(/exportconst|const/g, '\nconst ');
    content = content.replace(/exportlet|let/g, '\nlet ');
    content = content.replace(/exportvar|var/g, '\nvar ');

    //match character begin the key until '=[' and end with ']\n' or last ']'
    let regexForFindMenuArrContent = new RegExp(`(?:${key}.*?\\=\\[)(.*?)(?:\\](?:$|\\;\n|\n))`);
    let menuArrContent = content.match(regexForFindMenuArrContent)?.[1];

    //keluarkan semua array dan replace double comma dengan satu comma
    menuArrContent = menuArrContent?.replace(/\.\.\.\[|]/g, '').replace(/\,+/g, ',');

    //ambil semua isi dari object literal dalam array menu
    //Output: menuId: '', menuSequence: '', dst
    menuArrContent?.match(/(?<=\{).*?(?=\})/g)?.forEach(
        (menu) => {
            let resMenu: MenuInfo = {
                menuId: '',
                menuSequence: '',
                icon: '',
                url: ''
            };

            menu.split(',').forEach(
                (menuVal) => {
                    if (menuVal.trim().length > 0) {
                        let menuValSet = menuVal.split(':');

                        for (const keyResMenu in resMenu) {
                            if (keyResMenu === menuValSet[0].replace(/\"|\'/g, '')) {
                                resMenu[keyResMenu as keyof typeof resMenu] =
                                    menuValSet[1].replace(/\"|\'/g, '');
                            }
                        }
                    }
                }
            );

            resMenus = [...resMenus, resMenu];
        }
    );

    // erase literal menu object
    menuArrContent = menuArrContent?.replace(/\{(.*?)\}/g, '').replace(/\,+/g, ',');

    //get variable object value in array menu if exist
    menuArrContent?.split(',').forEach(
        (menuVar) => {
            if (menuVar.trim().length > 0) {

                //handle if there are array variable in menu array with spread operator
                if (menuVar.search(/\.\.\./) != -1) {
                    //handle later when cases found
                } else {
                    let resMenu: MenuInfo = {
                        menuId: '',
                        menuSequence: '',
                        icon: '',
                        url: ''
                    };

                    let regexForFindVarObjVal =
                        new RegExp(`(?:${menuVar}.*?\\=\\{)(.*?)(?:\\})`);

                    content.match(regexForFindVarObjVal)?.[1].split(',').forEach(
                        (menuVal) => {
                            if (menuVal.trim().length > 0) {
                                let menuValSet = menuVal.split(':');

                                for (const keyResMenu in resMenu) {
                                    if (keyResMenu === menuValSet[0].replace(/\"|\'/g, '')) {
                                        resMenu[keyResMenu as keyof typeof resMenu] =
                                            menuValSet[1].replace(/\"|\'/g, '');
                                    } else {
                                        resMenu.variable = menuVar;
                                    }
                                }
                            }
                        }
                    );

                    resMenus = [...resMenus, resMenu];
                }
            }
        }
    );

    return resMenus;
}

export const mapMenuInfoData = (menuInfoList: MenuInfo[],
    modulUrlInfoList: ModulUrlInfo[]) => {
    let menuStructuresWithIconExist: MenuStructure[] = [];
    let newModulUrlInfoList: MenuStructure[] = [];

    menuInfoList.filter(
        (menuInfo) => {
            return menuInfo.url !== undefined || menuInfo.icon !== undefined
        }
    ).forEach(
        (menuInfo) => {
            // let 
            if (menuInfo.url !== undefined && menuInfo.url.trim().length > 0) {
                modulUrlInfoList.forEach(
                    (modulUrlInfo) => {
                        if (menuInfo.url === modulUrlInfo.url) {
                            let newModulUrlInfo: MenuStructure = {
                                modulId: modulUrlInfo.modulId,
                                routingPath: modulUrlInfo.url,
                                iconClass: menuInfo.icon,
                                variable: menuInfo.variable
                            };
                            newModulUrlInfoList.push(newModulUrlInfo);
                            return;
                        } else {
                            return;
                        }
                    }
                );
            } else if (menuInfo.icon !== undefined
                && menuInfo.icon?.trim().length > 0) {

                let menuStructIconExist: MenuStructure = {
                    menuId: menuInfo.menuId,
                    menuSequence: menuInfo.menuSequence,
                    iconClass: menuInfo.icon
                };

                menuStructuresWithIconExist.push(menuStructIconExist);
            }
        }
    );

    return {
        menuInfoList: menuStructuresWithIconExist,
        modulUrlInfoList: newModulUrlInfoList
    }
}