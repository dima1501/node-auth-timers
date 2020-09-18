const { nanoid } = require("nanoid");
const crypto = require("crypto");
const UserModel = require("../models/User");

const DB = {
  users: [
    {
      _id: nanoid(),
      username: "admin",
      password: crypto.createHash("sha256").update("qwerty").digest("hex"),
    },
  ],
  sessions: {},
};

class UsersService {
  users() {
    return DB.users;
  }
  sessions() {
    return DB.sessions;
  }
  findUserByUsername(username) {
    return DB.users.find((u) => u.username === username);
  }
  findUserBySessionId(sessionId) {
    const userId = DB.sessions[sessionId];
    if (!userId) {
      return;
    }
    return DB.users.find((u) => u._id === userId);
  }
  createSession(userId) {
    const sessionId = nanoid();
    DB.sessions[sessionId] = userId;
    return sessionId;
  }
  deleteSession(sessionId) {
    delete DB.sessions[sessionId];
  }
  createUser(username, password) {
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    const user = new UserModel(nanoid(), username, passwordHash);
    DB.users.push(user);
    return user;
  }
}

module.exports = UsersService;
