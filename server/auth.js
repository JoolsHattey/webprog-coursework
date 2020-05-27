const firebase = require('firebase-admin');

const decodeAuthToken = async (req, res, next) => {
  if (!req.headers.id_token) {
    return res.status(400).json({
      error: {
        message: 'This request requires authentication headers',
      },
    });
  }
  try {
    const userPayload = await firebase.auth().verifyIdToken(req.headers.id_token);
    req.user = userPayload;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      error: {
        message: 'You are not authorised to perform this aciton. Please login.',
      },
    });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.user.admin) {
      next();
    } else {
      return res.staus(403).json({
        error: {
          message: 'You do not have access to the requested resource.',
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        message: 'Error occured while getting user roles.',
      },
    });
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

module.exports = {
  decodeAuthToken,
  isAuthenticated,
  isAdmin,
  grantAdminRole,
  getUserRole,
};
