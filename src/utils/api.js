export default class Api {
  constructor(options = {}) {
    this._baseUrl = options.baseUrl || "";
    this._headers = options.headers || {};
  }

  async getInitialCards() {
    const res = await fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return await res.json();
  }
}
