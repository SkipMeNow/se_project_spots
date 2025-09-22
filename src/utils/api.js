export default class Api {
  constructor(options = {}) {
    this._baseUrl = options.baseUrl || "";
    this._headers = options.headers || {};
  }

  async getInitialCards() {
    const res = await fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`Error: ${res.status}`);
  }

  async getUserInfo() {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`Error: ${res.status}`);
  }

  async updateUserInfo(userData) {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(userData),
    });
    if (res.ok) {
      return res.json();
    }
    return await Promise.reject(`Error: ${res.status}`);
  }

  async updateAvatar(avatarUrl) {
    const res = await fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar: avatarUrl }),
    });
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return await res.json();
  }

  async createCard(cardData) {
    const res = await fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(cardData),
    });
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return await res.json();
  }

  async deleteCard(cardId) {
    const res = await fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return await res.json();
  }

  async likeCard(cardId) {
    const res = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return await res.json();
  }

  async dislikeCard(cardId) {
    const res = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    });
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return await res.json();
  }

  getAppData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }
}
