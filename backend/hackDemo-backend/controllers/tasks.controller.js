const {
  insertTaskWithDetails,
  deleteTaskById,
  updateTaskStatus,
  getAllTasksByUser,
  updateTaskRow,
  getTaskById,
} = require("../models/taskQueries");

const { suggestions } = require("../services/ai.services")

// POST /task -> create task
async function addTask(req, resp) {
  try {
    const { id: userId } = req.user;
    const { title, description, priority, duedate, tag, groupId, assignedTo } = req.body;

    if (!userId) return resp.status(401).json({ message: "Unauthorized" });
    if (!title) return resp.status(400).json({ message: "Missing task title" });

    const task = await insertTaskWithDetails({
      title,
      description,
      duedate,
      priority,
      tag,
      createdBy: userId,
      assignedTo: assignedTo || null,
      groupId: groupId || null,
    });

    if (!task || typeof task.id !== "number") {
      return resp.status(500).json({ message: "Failed to insert task" });
    }

    console.log(`Task added: "${title}" with taskId ${task.id}`);
    return resp.status(200).json({ message: "Task added", task });
  } catch (err) {
    console.error("Error in inserting task:", err.message);
    return resp.status(500).json({ message: "Error in adding task" });
  }
}

// DELETE /task/:id
async function deleteTask(req, resp) {
  try {
    const taskId = req.params.id;
    if (!taskId) return resp.status(400).json({ message: "Missing task ID" });

    const affectedRows = await deleteTaskById(taskId);
    if (affectedRows === 0) {
      return resp.status(404).json({ message: "Task not found or not deleted" });
    }

    return resp.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err.message);
    return resp.status(500).json({ message: "Error deleting task" });
  }
}

// PATCH /update/:id -> update fields 
async function updateTask(req, resp) {
  try {
    const taskId = req.params.id;
    const {
      title,
      description,
      duedate,
      priority,
      tag,
    } = req.body;

    const affectedRows = await updateTaskRow(
      taskId,
      title,
      description,
      duedate,
      priority,
      tag,
    );

    if (affectedRows === 0) {
      return resp.status(404).json({ message: "No task updated" });
    }

    return resp.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Update error:", err.message);
    return resp.status(500).json({ message: "Internal server error" });
  }
}

// patch in updateStatus/:id
async function updateStatus(req, resp) {
  try {
    const { id: userId } = req.user;
    const { isCompleted } = req.body;
    if(typeof isCompleted !== "boolean"){
      return resp.status(400).json({message : "isCompleted must be boolean"})
    }
    const taskId = req.params.id;
    const task = await getTaskById(taskId);
    if(!task){
      return resp.status(404).json({message : "Task not found "});
    }
    if(task.created_by !== userId){
      return resp.status(401).json({message : "User not authorized"});
    }
    const affectedRows = await updateTaskStatus(taskId , isCompleted);
    if(affectedRows === 0){
      return resp.status(500).json({message : "No changes in rows made "});
    }
    return resp.status(200).json({message : `Status changed to ${isCompleted}`});
  }catch(err){
    console.log("Error in changing task status.... " + err.message);
    return resp.status(500).json({message : "Error in updating "});
  }
}

async function getAllTasks(req, resp) {
  try {
    const { id: userId } = req.user;
    if (!userId) {
      return resp.status(400).json({ message: "Missing user " });
    }
    const ans = await getAllTasksByUser(userId);
    if (!ans) {
      return resp.status(404).json({ message: "No tasks found" });
    }
    return resp.status(200).json({ tasks: ans });
  } catch (err) {
    console.log("There is some error in get all tasks ");
    return resp.status(500).json({ message: "There is some internal error " });
  }
}

//this expects task id in the params
async function getTaskByIdSingle(req, resp) {
  try {
    const taskId = req.params.id;
    const { id: userId } = req.user;
    if (!taskId) {
      return resp.status(404).json({ message: "No taskId" });
    }
    if (!userId) {
      return resp.status(404).json({ message: "No user found" });
    }
    const ans = await getTaskById(taskId);
    if (ans.created_by !== userId) {
      // console.log("User Id = " , userId);
      // console.log("created by = " , ans.created_by);
      return resp.status(401).json({ message: "User not authorized" });
    }
    if (!ans) {
      return resp.status(404).json({ message: "Task not found" });
    }
    return resp.status(200).json({ task: ans });
  } catch (err) {
    console.log("Error in fetching task by id ..." + err.message);
    return resp.status(500).json({ message: "Error in fetching task " });
  }
}


// GET /suggestions
async function getSuggestions(req, resp) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return resp.status(404).json({ message: "User not found" });
    }
    const allTasks = await getAllTasksByUser(userId);
    if (!allTasks) {
      return resp.status(404).json({ message: "No tasks present" });
    }
    const aiSuggestions = await suggestions(allTasks);
    if (!aiSuggestions) {
      return resp.status(500).json({ message: "Error in generating ai responses " });
    }
    return resp.status(200).json({ suggestions: aiSuggestions });
  } catch (err) {
    console.error("Error generating suggestions:", err.message);
    return resp.status(500).json({ message: "Error generating suggestions" });
  }
}

module.exports = {
  addTask,
  deleteTask,
  updateTask,
  getAllTasks,
  getTaskByIdSingle,
  getSuggestions,
  updateStatus,
};