const db = require("../dbConnection");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duedate TIMESTAMP,
    completed_at TIMESTAMP,
    priority VARCHAR(50),
    tag VARCHAR(100),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    created_by INT NOT NULL,
    assigned_to INT,
    group_id INT,

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
  );
`;


async function createTasksTable() {
  try {
    await db.query(createTableQuery);
    console.log("Tasks table created...");
  } catch (err) {
    console.error("Error creating tasks table:", err);
  }
}

async function insertTaskWithDetails({
  title,
  description,
  duedate,
  priority,
  tag,
  createdBy,
  assignedTo = null,
  groupId = null,
}) {
  const result = await db.query(
    `INSERT INTO tasks 
    (title, description, duedate, priority, tag, created_by, assigned_to, group_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [title, description, duedate, priority, tag, createdBy, assignedTo, groupId]
  );
  return result.rows[0];
}

async function getAllTasksByUser(userId) {
  const result = await db.query(
    `SELECT * FROM tasks WHERE created_by = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function getAssignedTasks(userId) {
  const result = await db.query(
    `SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function getTasksByGroup(groupId) {
  const result = await db.query(
    `SELECT * FROM tasks WHERE group_id = $1 ORDER BY created_at DESC`,
    [groupId]
  );
  return result.rows;
}

async function getTaskById(taskId) {
  const result = await db.query(
    `SELECT * FROM tasks WHERE id = $1`,
    [taskId]
  );
  return result.rows[0];
}


async function updateTaskStatus(taskId, isCompleted) {
  if (isCompleted) {
    const result = await db.query(
      `UPDATE tasks SET is_completed = true, completed_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [taskId]
    );
    return result.rowCount;
  } else {
    const result = await db.query(
      `UPDATE tasks SET is_completed = false, completed_at = NULL WHERE id = $1`,
      [taskId]
    );
    return result.rowCount;
  }
}

async function getTasksByStatus(userId, isCompleted) {
  const result = await db.query(
    `SELECT * FROM tasks WHERE created_by = $1 AND is_completed = $2 ORDER BY created_at DESC`,
    [userId, isCompleted]
  );
  return result.rows;
}

async function updateTaskRow(
  taskId,
  title,
  description,
  duedate,
  priority,
  tag,
  is_completed
) {
  const query = `
    UPDATE tasks
    SET title = $1,
        description = $2,
        duedate = $3,
        priority = $4,
        tag = $5,
        is_completed = $6
    WHERE id = $7
  `;

  const values = [title, description, duedate, priority, tag, is_completed, taskId];

  const result = await db.query(query, values);
  return result.rowCount;
}


async function deleteTaskById(taskId) {
  const result = await db.query(
    `DELETE FROM tasks WHERE id = $1`,
    [taskId]
  );
  return result.rowCount;
}

module.exports = {
  insertTaskWithDetails,
  getAllTasksByUser,
  getAssignedTasks,
  getTasksByGroup,
  getTaskById,
  updateTaskStatus,
  deleteTaskById,
  getTasksByStatus,
  createTasksTable,
  updateTaskRow
};
