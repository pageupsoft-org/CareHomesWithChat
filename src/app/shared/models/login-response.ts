export interface userLoginResponse {
        accessToken: string,
        careHomeId: number,
        id: number,
        locationIds: Array<number>,
        originalUserName: string,
        refreshToken: string,
        role: string,
        userName:string,
}