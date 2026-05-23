import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const getMembers = async () => {
  const querySnapshot = await getDocs(collection(db, "members"));
  
  const memberList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // นับจำนวนข้อมูลทั้งหมด
  const totalMembers = memberList.length;

  console.log("ข้อมูลสมาชิกทั้งหมด:", memberList);
  console.log("จำนวนสมาชิก:", totalMembers);

  return {
    members: memberList,
    total: totalMembers
  };
};