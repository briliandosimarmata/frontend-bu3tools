export class MenuStructure {
    menuId?: string = '';
    menuSequence?: string = '';
    menuDesc?: string = '';
    modulId?: string = '';
    iconClass?: string = '';
    routingPath?: string = '';

    public static fromApiResponse(response: any): MenuStructure {
        let menuStructure: MenuStructure = new MenuStructure();

        for (const key in menuStructure) {
            if (response[key] != null && response[key] != undefined) {
                menuStructure[key as keyof MenuStructure] = response[key];
            }
        }

        return menuStructure;
    }

    public static fromApiResponses(responses: any[]): MenuStructure[] {
        let menuStructures: MenuStructure[] = [];
        responses.forEach(
            res => {
                menuStructures.push(this.fromApiResponse(res));
            }
        );

        return menuStructures;
    }
}


