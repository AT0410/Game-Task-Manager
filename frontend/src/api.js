import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Adjust the base URL as needed
});

const fetchUser = async (token) => {
  try {
    const response = await api.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch user error:", error);
    throw error;
  }
};

const loginUser = async (loginData) => {
  const formData = new URLSearchParams();
  formData.append("username", loginData.username);
  formData.append("password", loginData.password);

  try {
    const response = await api.post("/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
};

const registerUser = async (userData) => {
  try {
    await api.post("/register", userData);
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const deleteUser = async (token) => {
  try {
    await api.delete("/user/delete", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const updateProfile = async (token, profileData) => {
  try {
    await api.patch("/user/updateprofile", profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log("Update profile error:", error);
  }
};

const changePassword = async (token, passwordData) => {
  return await api.patch("/user/updatepassword", passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const getTasks = async (token) => {
  try {
    const response = await api.get("/user/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const headers = [
      "id",
      "title",
      "description",
      "due_date",
      "completed",
      "category",
    ];
    const rows = response.data;
    const dict = rows.map((row) =>
      Object.fromEntries(headers.map((colName, idx) => [colName, row[idx]]))
    );
    console.log(dict);
    return dict;
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    throw error;
  }
};

const addTask = async (token, taskData) => {
  try {
    const id = await api.post("/user/addtask", taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (token, taskid) => {
  try {
    await api.delete(`/user/deletetask/${taskid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

const updateTask = async (token, taskData) => {
  try {
    await api.patch("/user/updatetask", taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default api;
export {
  fetchUser,
  registerUser,
  loginUser,
  updateProfile,
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  changePassword,
  deleteUser,
};
