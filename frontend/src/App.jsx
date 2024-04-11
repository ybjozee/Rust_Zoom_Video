import { Flex } from "antd";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Rooms from "./components/Rooms.jsx";
import JoinRoom from "./components/JoinRoom.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Rooms /> },
  { path: "/room/:id", element: <JoinRoom /> },
]);

const App = () => {
  const boxStyle = {
    width: "100%",
    height: "100vh",
  };

  return (
    <Flex gap="middle" align="center" vertical>
      <Flex style={boxStyle} justify="center" align="center">
        <RouterProvider router={router} />
      </Flex>
    </Flex>
  );
};

export default App;
