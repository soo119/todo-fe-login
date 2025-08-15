// import React, { useEffect, useState } from "react";
// import TodoBoard from "../components/TodoBoard";
// import api from "../utils/api";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import Container from "react-bootstrap/Container";

// const TodoPage = () => {
//   const [todoList, setTodoList] = useState([]);
//   const [todoValue, setTodoValue] = useState("");

//   const getTasks = async () => {
//     const response = await api.get("/tasks");
//     console.log("taskList",response.data.data)
//     setTodoList(response.data.data);
//   };
//   useEffect(() => {
//     getTasks();
//   }, []);
//   const addTodo = async () => {
//     try {
//       const response = await api.post("/tasks", {
//         task: todoValue,
//         isComplete: false,
//       });
//       if (response.status === 200) {
//         getTasks();
//       }
//       setTodoValue("");
//     } catch (error) {
//       console.log("error:", error);
//     }
//   };

//   const deleteItem = async (id) => {
//     try {
//       console.log(id);
//       const response = await api.delete(`/tasks/${id}`);
//       if (response.status === 200) {
//         getTasks();
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const toggleComplete = async (id) => {
//     try {
//       const task = todoList.find((item) => item._id === id);
//       const response = await api.put(`/tasks/${id}`, {
//         isComplete: !task.isComplete,
//       });
//       if (response.status === 200) {
//         getTasks();
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };
//   return (
//     <Container>
//       <Row className="add-item-row">
//         <Col xs={12} sm={10}>
//           <input
//             type="text"
//             placeholder="할일을 입력하세요"
//             onChange={(event) => setTodoValue(event.target.value)}
//             className="input-box"
//             value={todoValue}
//           />
//         </Col>
//         <Col xs={12} sm={2}>
//           <button onClick={addTodo} className="button-add">
//             추가
//           </button>
//         </Col>
//       </Row>

//       <TodoBoard
//         todoList={todoList}
//         deleteItem={deleteItem}
//         toggleComplete={toggleComplete}
//       />
//     </Container>
//   );
// };

// export default TodoPage;








import React, { useEffect, useState } from "react";
import TodoBoard from "../components/TodoBoard";
import api from "../utils/api";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

const TodoPage = ({ onLogout }) => {                 // ⭐ 추가: 로그아웃 핸들러 prop
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  const getTasks = async () => {
    try {                                            // ⭐ 추가: 에러 가드
      const response = await api.get("/tasks");  // ✏️ 변경: /tasks → /api/tasks
      console.log("taskList", response.data.data);
      setTodoList(response.data.data);
    } catch (e) {
      console.error("getTasks error:", e?.response?.data || e.message);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTodo = async () => {
    try {
      const response = await api.post("/tasks", { // ✏️ 변경
        task: todoValue,
        isComplete: false,
      });
      // if (response.status === 200) getTasks();
      if (response.status >= 200 && response.status < 300) {
        await getTasks(); //  변경: 항상 새로고침
      }
      setTodoValue("");
    } catch (error) {
      console.log("error:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`); // ✏️ 변경
      // if (response.status === 200) getTasks();
      if (response.status >= 200 && response.status < 300) {
      await getTasks(); //  변경: 항상 새로고침
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {   // ✏️ 변경
        isComplete: !task.isComplete,
      });
      // if (response.status === 200) getTasks();
      if (response.status >= 200 && response.status < 300) {
        await getTasks(); //  변경: 항상 새로고침
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Container>
      {/* ⭐ 추가: 상단 바 + 로그아웃 버튼 */}
      <Row className="align-items-center" style={{ marginTop: 16, marginBottom: 8 }}>
        <Col><h3 style={{ margin: 0 }}>Todo</h3></Col>
        <Col xs="auto">
          <button onClick={onLogout} className="button-add">로그아웃</button>
        </Col>
      </Row>

      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요"
            onChange={(event) => setTodoValue(event.target.value)}
            className="input-box"
            value={todoValue}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button onClick={addTodo} className="button-add">
            추가
          </button>
        </Col>
      </Row>

      <TodoBoard
        todoList={todoList}
        deleteItem={deleteItem}
        toggleComplete={toggleComplete}
      />
    </Container>
  );
};

export default TodoPage;
