import fetch from 'node-fetch';

export interface Token {
  expires_at: string;
  request_token: string;
  success: boolean;
}

export default class MovieDB {
  public apiKey: string;
  public baseURL: string;
  public token: Token;
  public sessionId: string;
  public userId: number;

  constructor(apiKey: string, baseURL = 'https://api.themoviedb.org/3') {
    if (!apiKey) {
      throw Error('Wrong API Key');
    }
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.token = {
      expires_at: '',
      request_token: '',
      success: false,
    };
    (this.sessionId = ''), (this.userId = 0);
  }

  public async requestToken() {
    const token = await this.retriveData(`${this.baseURL}/authentication/token/new?api_key=${this.apiKey}`);
    this.token = token;
    return this.token.request_token;
  }

  public async discoverPopularMovies() {
    const movies = await this.retriveData(
      `${this.baseURL}/discover/movie?api_key=${this.apiKey}&sort_by=popularity.desc`,
    );
    return movies;
  }

  public async getMovieDetails(id: number) {
    const movie = await this.retriveData(`${this.baseURL}/movie/${id}?api_key=${this.apiKey}`);
    return movie;
  }

  public async getUserDetails() {
    const userDetails = await this.retriveData(
      `${this.baseURL}/account?api_key=${this.apiKey}&&session_id=${this.sessionId}`,
    );
    this.userId = userDetails.id;
    return userDetails;
  }

  public async getUserFavorites() {
    const userFavorites = await this.retriveData(
      `${this.baseURL}/account/${this.userId}/favorite/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`,
    );
    return userFavorites;
  }

  public async getUserLists() {
    const userLists = await this.retriveData(
      `${this.baseURL}/account/${this.userId}/lists?api_key=${this.apiKey}&session_id=${this.sessionId}`,
    );
    return userLists;
  }

  public async favoriteMovie(id: number, favorite: boolean) {
    const result = await this.postData(
      `${this.baseURL}/account/${this.userId}/favorite?api_key=${this.apiKey}`,
      JSON.stringify({ media_type: 'movie', media_id: id, favorite }),
    );
  }

  public async requestSession(userToken: string) {
    const session = await this.postData(
      `${this.baseURL}/authentication/session/new?api_key=${this.apiKey}`,
      JSON.stringify({ request_token: userToken }),
    );
    this.sessionId = session.session_id;
    return this.sessionId;
  }

  public async postData(url: string, body: any) {
    const result = await fetch(url, {
      body,
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
    });
    const resultJson = await result.json();
    return resultJson;
  }

  public async retriveData(url: string) {
    const result = await fetch(url);
    const resultJson = await result.json();
    return resultJson;
  }
}
