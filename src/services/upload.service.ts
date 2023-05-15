import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import firebaseConfig from "../configs/firebase.config";
import { AppDefaults, ImageMimeType } from "../data/app.constants";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadFileOnFirebase = (file: Express.Multer.File): Promise<string | null> => {
  return new Promise<string | null>(async (resolve, reject) => {
    let fileName = file.originalname.toLowerCase().split(" ").join("");
    const ext = (ImageMimeType as any)[file.mimetype];
    fileName = `${fileName}-${Date.now()}.${ext}`;

    const storageRef = ref(storage, `${AppDefaults.FIREBASE_STORAGE_FOLDER_NAME}/${fileName}`);
    const metadata = { contentType: file.mimetype, name: file.originalname };

    await uploadBytes(storageRef, file.buffer, metadata)
      .then(async (snapshot) => {
        const uploadedFileUrl = await getDownloadURL(snapshot.ref);
        resolve(uploadedFileUrl);
      })
      .catch((error) => {
        resolve(null);
      });
  });
};

export { uploadFileOnFirebase };
