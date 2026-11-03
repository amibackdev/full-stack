import { v4 as uuidv4 } from "uuid";

class FileService {
    async saveFile(file){
        try{
          
            if(!file){
                throw new Error("file not transferred")
            }

            const MAX_SIZE = 5 * 1024 * 1024

            if(file.size > MAX_SIZE){
                throw new Error("The file is too large. Maximum 5 MB")
            }

            const typesImage = ['image/jpeg', "image/jpg", "image/gif", "image/png", "image/webp" ]

            if(!typesImage.includes(file.mimetype)){
                throw new Error("Недопустимый формат. Разрешены тольк JPG, JPEG, WEBP, PNG, GIF")
            }

            const fileType = file.name.split(".").pop()
            const fileName = `${uuidv4()}.${fileType}`
            const filePath = `./uploads/${fileName}`

            await file.mv(filePath)

            return filePath;
        }catch(err){
            throw err
        }
    }
}

export default new FileService;