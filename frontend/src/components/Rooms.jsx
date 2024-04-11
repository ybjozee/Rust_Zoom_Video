import { useEffect, useState } from "react";
import { getRooms } from "../Api";
import { Button, Card, List, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddRoom from "./AddRoom";
import { Link } from "react-router-dom";
import useNotification from "../hooks/useNotification";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [formVisibility, setFormVisibility] = useState(false);
  const [contextHolder, showFailure, showSuccess] = useNotification();

  const handleError = (message) => {
    showFailure({
      title: "Failed to create room",
      message,
    });
  };

  const handleAddition = (newRoom) => {
    setRooms((rooms) => [...rooms, newRoom]);
    showSuccess({
      title: "Success",
      message: "Room created successfully",
    });
  };

  useEffect(() => {
    const loadRooms = async () => {
      const rooms = await getRooms();
      setRooms(rooms);
    };
    loadRooms();
  }, []);

  return (
    <>
      {contextHolder}
      <Card
        title="Available rooms"
        bordered={false}
        style={{ width: 400 }}
        actions={[
          <Tooltip title="Add a new room">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setFormVisibility((showAddRoomModal) => !showAddRoomModal);
              }}
            >
              Add Room
            </Button>
          </Tooltip>,
        ]}
      >
        <List
          itemLayout="horizontal"
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item>
              <List.Item.Meta
                title={<Link to={`/room/${room.identity}`}>{room.name}</Link>}
              />
            </List.Item>
          )}
        />
      </Card>
      <AddRoom
        onError={handleError}
        onAddition={handleAddition}
        isVisible={formVisibility}
        setVisibility={setFormVisibility}
      />
    </>
  );
};

export default Rooms;

