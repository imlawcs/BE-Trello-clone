export interface CustomResponseResult {
    isOk: boolean
    status?: number
    message: string | string[]
    data?: object
}