import firebaseAdmin from "firebase-admin";
// import serviceAccount from "./servicesAccountKey.json";

const firebaseAdminApp = firebaseAdmin.initializeApp({
  // credential: firebaseAdmin.credential.cert(
  //   serviceAccount as firebaseAdmin.ServiceAccount
  // ),
  credential: firebaseAdmin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSAL_DOMAIL,
  } as firebaseAdmin.ServiceAccount),
});

export default firebaseAdminApp;
