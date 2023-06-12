export interface HttpResponse {
    data?: any,
    message?: {
        code: string,
        description: string
    },
    status?: string
}
