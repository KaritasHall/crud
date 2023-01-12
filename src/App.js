import { useEffect, useState, useCallback } from "react";
import {
  AddTask,
  Heading,
  Wrapper,
  Input,
  TaskList,
  Checkbox,
  Task,
  AddButton,
} from "./styles";

// Here is the URL from the cloud server. Before I put the server on the cloud it was localhost:5000
// I'm choosing to store it in a variable because it's quite long and I want to keep my code readble
const apiURL = "https://us-central1-crud-project-930c5.cloudfunctions.net/app";

function App() {
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState("");

  // PUT
  const updateTask = useCallback(async (task) => {
    const response = await fetch(`${apiURL}/todos/${task.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...task,
        completed: !task.completed,
      }),
    });

    // converting the response to a usable json object
    const updatedTask = await response.json();

    if (!response.ok) {
      // handle the error
      alert("Error occured while updating task.");
    } else {
      // update the task in the local state
      setTasks((prev) => {
        return prev.map((prevTask) => {
          return prevTask.id === updatedTask.id ? updatedTask : prevTask;
        });
      });
    }
  }, []);

  //DELETE
  const deleteTask = useCallback(async (taskId) => {
    // send a DELETE request to the server to delete the task
    const response = await fetch(`${apiURL}/todos/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      // handle the error
      alert("Error occured while deleting task.");
    } else {
      //remove the task from the local state
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }
    console.log("task deleted");
  }, []);

  // POST
  const createTask = useCallback(async () => {
    const response = await fetch(`${apiURL}/todos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: newTask,
      }),
    });

    // converting the response to a usable json object
    const task = await response.json();

    // add the new task to our list!
    setTasks((prev) => {
      return [...prev, task];
    });
  }, [newTask]);

  // GET
  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log(data);

      setTasks(data);
    };

    getTasks();
  }, []);

  return (
    <Wrapper>
      <Heading>To do list</Heading>
      <AddTask>
        <Input
          placeholder="Task..."
          onChange={(event) => {
            setNewTask(event.target.value);
          }}
        />
        <AddButton onClick={createTask}>Add task</AddButton>
      </AddTask>

      {tasks.map((task) => {
        return (
          <TaskList key={task.id}>
            <Checkbox
              type="checkbox"
              defaultChecked={task.completed}
              checked={task.completed}
              onChange={() => {
                updateTask(task);
              }}
            />

            <Task>{task.name}</Task>
            <button onClick={() => deleteTask(task.id)}>x</button>
          </TaskList>
        );
      })}
    </Wrapper>
  );
}

export default App;
