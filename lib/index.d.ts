export interface Token {
    success: boolean;
    expires_at: string;
    request_token: string;
}
export default class MovieDB {
    apiKey: string;
    baseURL: string;
    token: Token;
    sessionId: string;
    userId: number;
    constructor(apiKey: string, baseURL?: string);
    requestToken(): Promise<string>;
    discoverPopularMovies(): Promise<any>;
    getMovieDetails(id: number): Promise<any>;
    getUserDetails(): Promise<any>;
    getUserFavorites(): Promise<any>;
    getUserLists(): Promise<any>;
    favoriteMovie(id: number, favorite: boolean): Promise<void>;
    requestSession(userToken: string): Promise<string>;
    postData(url: string, body: any): Promise<any>;
    retriveData(url: string): Promise<any>;
}
