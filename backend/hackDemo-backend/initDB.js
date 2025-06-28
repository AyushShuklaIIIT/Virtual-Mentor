const { createUsersTable } = require("./models/userQueries");
const { createTasksTable } = require("./models/taskQueries");
const { createGroupsTable } = require("./models/groupTable");
const { createGroupMembersTable } = require("./models/groupMember");

(async () => {
  await createUsersTable();
  await createGroupsTable();
  await createGroupMembersTable();
  await createTasksTable();
})();
