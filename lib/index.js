"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
class MovieDB {
    constructor(apiKey, baseURL = 'https://api.themoviedb.org/3') {
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
    requestToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.retriveData(`${this.baseURL}/authentication/token/new?api_key=${this.apiKey}`);
            this.token = token;
            return this.token.request_token;
        });
    }
    discoverPopularMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            const movies = yield this.retriveData(`${this.baseURL}/discover/movie?api_key=${this.apiKey}&sort_by=popularity.desc`);
            return movies;
        });
    }
    getMovieDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield this.retriveData(`${this.baseURL}/movie/${id}?api_key=${this.apiKey}`);
            return movie;
        });
    }
    getUserDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const userDetails = yield this.retriveData(`${this.baseURL}/account?api_key=${this.apiKey}&&session_id=${this.sessionId}`);
            this.userId = userDetails.id;
            return userDetails;
        });
    }
    getUserFavorites() {
        return __awaiter(this, void 0, void 0, function* () {
            const userFavorites = yield this.retriveData(`${this.baseURL}/account/${this.userId}/favorite/movies?api_key=${this.apiKey}&session_id=${this.sessionId}`);
            return userFavorites;
        });
    }
    getUserLists() {
        return __awaiter(this, void 0, void 0, function* () {
            const userLists = yield this.retriveData(`${this.baseURL}/account/${this.userId}/lists?api_key=${this.apiKey}&session_id=${this.sessionId}`);
            return userLists;
        });
    }
    favoriteMovie(id, favorite) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postData(`${this.baseURL}/account/${this.userId}/favorite?api_key=${this.apiKey}`, JSON.stringify({ media_type: 'movie', media_id: id, favorite }));
        });
    }
    requestSession(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.postData(`${this.baseURL}/authentication/session/new?api_key=${this.apiKey}`, JSON.stringify({ request_token: userToken }));
            this.sessionId = session.session_id;
            return this.sessionId;
        });
    }
    postData(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield node_fetch_1.default(url, {
                body,
                headers: { 'Content-Type': 'application/json' },
                method: 'post',
            });
            const resultJson = yield result.json();
            return resultJson;
        });
    }
    retriveData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield node_fetch_1.default(url);
            const resultJson = yield result.json();
            return resultJson;
        });
    }
}
exports.default = MovieDB;
