import tracker from "../models/tracker.js";
import fileService from "../middleware/fileService.js";

class TrackerController{
     async getTasks(req, res){
        try{
            const tasks = await tracker.find();
            res.status(200).json(tasks);
        }catch(err){
            res.status(404).json("Ошибка при получении пользователей: " + err)
        }
     }

     async getOneTask(req, res){
        try{
            const { id } = req.params;
            const task = await tracker.findById(id);
            if(!task){
                return res.status(404).json("Такой задачи не существует")
            }
            res.status(200).json(task);
        }catch(err){
            res.status(500).json("Ошибка при выполнении запроса: " + err)
        }
     }

     async addTask(req, res){
        console.log(req.files);
        try{
            let fileName = null;

            if(req.files && req.files.photo){
                fileName = await fileService.saveFile(req.files.photo)
            }

            console.log("Данные формы:", req.body);
            console.log("Загруженный файл:", req.file);

            const { title, description, priority, deadline } = req.body

            if(!title || !description){
                return res.status(400).json({ message: "Заголовок и описание обязательны для заполнения" });
            }

            const newTask = await tracker.create({
                title, 
                description,
                priority,
                deadline,
                photo: fileName
            });
            return res.status(200).json(newTask);
        }catch(err){
            console.log("Ошибка при добвлении задачи" + err);
            return res.status(500).json({message: "Ошибка при добавлении на сервере", error: err.message })
            
        }
     }

     async updateTask(req, res){
        try {
            const { id } = req.params;
            const { title, description, priority, deadline } = req.body;
            const updateTask = await tracker.findByIdAndUpdate(
              id,
              {
                title, 
                description, 
                priority, 
                deadline
              },
              { new: true },
            );
            if (!updateTask) {
              return res.status(404).json("Такой задачи не существует!");
            }
            res.status(200).json(updateTask);
          } catch (err) {
            res.status(500).json("Ошибка при обновлении: " + err);
          }
     }

     async deleteTask(req, res){
        try{
            const { id } = req.params;
            const task = await tracker.findByIdAndDelete(id);
            if(!task){
                return res.status(404).json("ТАКОЙ ЗАДЛАЧИ НЕТ")
            }
            res.status(200).json("задача удалена")
        }catch(err){
            res.status(500).json("Ошибка при выполнении запроса: " + err)
        }

     }
}

export default new TrackerController();