import styled from "styled-components";

export const Wrapper = styled.div`
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: auto;
`;

export const Heading = styled.h1`
  color: tomato;
  text-align: center;
`;

export const AddTask = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  padding-bottom: 20px;
`;

export const Input = styled.input`
  width: 200px;
  height: 28px;
`;

export const AddButton = styled.button`
  background-color: hotpink;
  border: none;
  border-radius: 5%;
  padding: 6px;
  cursor: pointer;
`;

export const TaskList = styled.ul`
  display: flex;
  list-style: none;
  gap: 8px;
  justify-content: flex-start;
  text-align: center;
  button {
    background-color: hotpink;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }
`;

export const Checkbox = styled.input`
  :checked + label {
    color: tomato;
    text-decoration: line-through;
  }
`;

export const Task = styled.label`
  text-align: center;
`;
