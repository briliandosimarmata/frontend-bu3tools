export interface ToastMessage {
    id: string,
    message: Message,
    type: 'error' | 'success' | 'none',
    transitionClass: string,
    isShown: boolean,
    intervalFunc?: NodeJS.Timer,
    delay?: number
}

export interface Message {
    code: string,
    description: string,
}

export const shownClass: string = 'mt-12 opacity-1 ';
export const hiddenClass: string = 'mt-4 opacity-0 ';