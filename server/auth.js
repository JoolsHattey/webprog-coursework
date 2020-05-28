const firebase = require('firebase-admin');
const createError = require('http-errors');

const decodeAuthToken = async (req, res, next) => {
  if (!req.headers.id_token) return next(createError(401, 'No authentication headers attached to request.'));
  try {
    const userPayload = await firebase.auth().verifyIdToken(req.headers.id_token);
    req.user = userPayload;
    next();
  } catch (error) {
    console.log(error);
    next(createError(500));
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return next(createError(401, 'You are not authorised to perform this aciton. Please login.'));
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    return next(createError(403, 'You do not have access to the requested resource.'));
  }
};

async function grantAdminRole(email) {
  const user = await firebase.auth().getUserByEmail(email); // 1
  if (user.customClaims && user.customClaims.admin === true) {
    return;
  } // 2
  return firebase.auth().setCustomUserClaims(user.uid, {
    admin: true,
  }); // 3
}

async function getUserRole(uid) {
  const user = await firebase.auth().getUser(uid);
  console.log(user);
}

const middleware = [decodeAuthToken, isAuthenticated, isAdmin];

module.exports = {
  middleware,
  grantAdminRole,
  getUserRole,
};
