import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { URL } from "../../App";
import Task from "../task/Task";
import TaskForm from "../taskForm/TaskForm";
import loader from "../../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });

  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field can't be empty");
    }
    try {
      await axios.post(`${URL}/api/v1/tasks`, formData);
      getTasks();
      toast.success("Task Added successfully !");
      setFormData({ ...formData, name: "" });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/v1/tasks`);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const getCompletedTasks = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(getCompletedTasks);
  }, [tasks]);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/v1/tasks/${id}`);
      getTasks();
      toast.success("Task deleted successfully !");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskID(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field can't be empty.");
    }
    try {
      await axios.put(`${URL}/api/v1/tasks/${taskID}`, formData);
      setFormData({ ...formData, name: "" });
      setIsEditing(false);
      getTasks();
      toast.success("Task updated successfully !");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };
    try {
      await axios.put(`${URL}/api/v1/tasks/${task._id}`, newFormData);
      getTasks();
      toast.success("Task completed !");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Task</b> {tasks.length}
          </p>
          <p>
            <b>Completed Task</b> {completedTasks.length}
          </p>
        </div>
      )}
      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loader} alt="loading" />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task found! please add a task.</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
