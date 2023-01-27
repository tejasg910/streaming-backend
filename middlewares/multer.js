import multer from "multer";

const storage = multer.memoryStorage();
const singleUpload = multer({ storage }).single("file");

//should be req.file only

export default singleUpload;
