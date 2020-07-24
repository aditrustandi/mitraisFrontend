export interface Data {
    phone: number,
    date_of_birth?: string,
    gender?: string,
    first_name: string,
    last_name: string,
    email: string
}

export interface AjaxResponse<T> {
    status: boolean,
    message: string,
    data: T
}
