const SESSION_DURATION_MINUTES = 60;
const INTERMEDIATE_SESSION_DURATION_MINUTES = 10;

const SESSION_COOKIE = "session";
const INTERMEDIATE_SESSION_COOKIE = "intermediate_session";

function setSession(req, res, sessionJWT) {
  res.cookie(SESSION_COOKIE, sessionJWT, {
    httpOnly: true,
    maxAge: 1000 * 60 * SESSION_DURATION_MINUTES, // minutes to milliseconds
  });
}

function clearSession(req, res) {
  res.clearCookie(SESSION_COOKIE);
}

function setIntermediateSession(req, res, intermediateSessionToken) {
    res.cookie(INTERMEDIATE_SESSION_COOKIE, intermediateSessionToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * INTERMEDIATE_SESSION_DURATION_MINUTES, // minutes to milliseconds
    })
}

function clearIntermediateSession(req, res) {
  res.clearCookie(INTERMEDIATE_SESSION_COOKIE);
}

function getIntermediateSession(req, res) {
  const intermediateSession = req.cookies[INTERMEDIATE_SESSION_COOKIE];
  return intermediateSession
}

function getDiscoverySessionData(req, res) {
  const intermediateSession = req.cookies[INTERMEDIATE_SESSION_COOKIE];
  
  if (intermediateSession) {
    return {
      intermediateSession,
      error: false,
    };
  }
  return { error: true };
}

function revokeSession(req, res, stytchClient) {
  const sessionJWT = req.cookies[SESSION_COOKIE];
  if (!sessionJWT) {
    return;
  }
  // Delete the session cookie by setting maxAge to 0
  res.cookie(SESSION_COOKIE, "", { maxAge: 0 });
  // Call Stytch in the background to terminate the session
  // But don't block on it!
  stytchClient.sessions
    .revoke({ session_jwt: sessionJWT })
    .then(() => {
      console.log("Session successfully revoked");
    })
    .catch((err) => {
      console.error("Could not revoke session", err);
    });
}

module.exports = {
  SESSION_DURATION_MINUTES,
  INTERMEDIATE_SESSION_DURATION_MINUTES,
  setSession,
  clearSession,
  setIntermediateSession,
  clearIntermediateSession,
  getIntermediateSession,
  getDiscoverySessionData,
  revokeSession
}