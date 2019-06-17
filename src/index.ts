const fetch = require('node-fetch');

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

  constructor(apiKey: string, baseURL = 'https://api.themoviedb.org/3') {
    if (!apiKey) throw Error('Wrong API Key');
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.token = {
      success: false,
      expires_at: '',
      request_token: ''
    };
    (this.sessionId = ''), (this.userId = 0);
  }

  async requestToken() {
    const token = await this.retriveData(
      `${this.baseURL}/authentication/token/new?api_key=${this.apiKey}`
    );
    this.token = token;
    return this.token.request_token;
  }

  async discoverPopularMovies() {
    const movies = await this.retriveData(
      `${this.baseURL}/discover/movie?api_key=${
        this.apiKey
      }&sort_by=popularity.desc`
    );
    return movies;
  }

  async getMovieDetails(id: number) {
    const movie = await this.retriveData(
      `${this.baseURL}/movie/${id}?api_key=${this.apiKey}`
    );
    return movie;
  }

  async getUserDetails() {
    const userDetails = await this.retriveData(
      `${this.baseURL}/account?api_key=${this.apiKey}&&session_id=${
        this.sessionId
      }`
    );
    this.userId = userDetails.id;
    return userDetails;
  }

  async getUserFavorites() {
    const userFavorites = await this.retriveData(
      `${this.baseURL}/account/${this.userId}/favorite/movies?api_key=${
        this.apiKey
      }&session_id=${this.sessionId}`
    );
    return userFavorites;
  }

  async getUserLists() {
    const userLists = await this.retriveData(
      `${this.baseURL}/account/${this.userId}/lists?api_key=${
        this.apiKey
      }&session_id=${this.sessionId}`
    );
    return userLists;
  }

  async favoriteMovie(id: number, favorite: boolean) {
    const result = await this.postData(
      `${this.baseURL}/account/${this.userId}/favorite?api_key=${this.apiKey}`,
      JSON.stringify({ media_type: 'movie', media_id: id, favorite })
    );
    console.log(result);
  }

  async requestSession(userToken: string) {
    const session = await this.postData(
      `${this.baseURL}/authentication/session/new?api_key=${this.apiKey}`,
      JSON.stringify({ request_token: userToken })
    );
    this.sessionId = session.session_id;
    return this.sessionId;
  }

  async postData(url: string, body: any) {
    console.log(JSON.stringify(body));
    const result = await fetch(url, {
      method: 'post',
      body,
      headers: { 'Content-Type': 'application/json' }
    });
    const resultJson = await result.json();
    return resultJson;
  }

  async retriveData(url: string) {
    const result = await fetch(url);
    const resultJson = await result.json();
    return resultJson;
  }
}
