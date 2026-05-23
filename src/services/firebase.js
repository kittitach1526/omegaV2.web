// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 1. เพิ่มตัวนี้เข้ามาเพื่อใช้ทำ CRUD

const firebaseConfig = {
  apiKey: "AIzaSyCHoiRTHMJpKW2a_InLqUTyz3492jKdlwU",
  authDomain: "omega-member-list.firebaseapp.com",
  projectId: "omega-member-list",
  storageBucket: "omega-member-list.firebasestorage.app",
  messagingSenderId: "325909168259",
  appId: "1:325909168259:web:95162b2495568e9e349bb6",
  measurementId: "G-1PDJR0NWVZ"
};

const app = initializeApp(firebaseConfig);

// 2. สร้างตัวแปร db และ Export ออกไปใช้งาน
export const db = getFirestore(app);