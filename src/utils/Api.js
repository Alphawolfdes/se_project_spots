class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  getInitialCards() {
    return this._request(`${this.baseUrl}/cards`, {
      headers: this.headers,
    });
  }

  editUserInfo({ name, about }) {
    return this._request(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({ name, about }),
    });
  }

  getUserInfo() {
    return this._request(`${this.baseUrl}/users/me`, {
      headers: this.headers,
    });
  }

  editAvatarUserInfo({ avatar }) {
    return this._request(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({ avatar }),
    });
  }

  addCard({ name, link }) {
    return this._request(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(id) {
    return this._request(`${this.baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this.headers,
    });
  }

  chnageLike(id, isLiked) {
    return this._request(`${this.baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this.headers,
    });
  }

  likeCard(cardId) {
    return this._request(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this.headers,
    });
  }

  unlikeCard(cardId) {
    return this._request(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this.headers,
    });
  }
}

export default Api;
