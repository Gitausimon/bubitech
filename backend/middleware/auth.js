const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
  try {
    const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
       const serviceAccount = require(serviceAccountPath);
       admin.initializeApp({
         credential: admin.credential.cert(serviceAccount)
       });
       console.log("✅ Firebase Admin Initialized with service account");
    } else {
       console.log("⚠️ Firebase Admin credentials not found. Auth will fail.");
    }
  } catch (err) {
    console.error("Firebase Admin Error:", err);
  }
}

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      
      next();
    } catch (error) {
      console.error("Firebase auth verification error:", error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
