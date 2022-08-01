const firebaseConfig = {
  apiKey: "GANTI DENGAN PROJECT KAMU",
  authDomain: "GANTI DENGAN PROJECT KAMU",
  databaseURL: "GANTI DENGAN PROJECT KAMU",
  projectId: "GANTI DENGAN PROJECT KAMU",
  storageBucket: "GANTI DENGAN PROJECT KAMU",
  messagingSenderId: "GANTI DENGAN PROJECT KAMU",
  appId: "GANTI DENGAN PROJECT KAMU"
};
const app = firebase.initializeApp(firebaseConfig);
const rdb = firebase.database();
const auth = firebase.auth();
const stg = firebase.storage();