const User = class User {
  constructor(id, username, password) {
    this._id = id;
    this.username = username;
    this.password = password;
  }
};

module.exports = User;
