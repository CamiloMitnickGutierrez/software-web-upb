import multer from "multer"

const storage = multer.memoryStorage()

const fileFilter = (req,file,cb) => {

    if(file.mimetype.startsWith('image/')){

        cb(null,true)
    }
    
    else {

        cb(new Error('Formato invalido. solo se permiten imagenes (JPG , PNG'),false)

    }
}

export const uploadPhotoMiddleware = multer({
    storage:storage,
    limits:{fileSize:5 * 1024 * 1024 },
    fileFilter:fileFilter
}).single('foto')