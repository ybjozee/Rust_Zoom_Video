import { getRoom, getRoomToken } from "../Api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useNotification from "../hooks/useNotification";
import ModalForm from "./ModalForm";
import { Button, Col, Divider, Flex, Form, Input, Row } from "antd";
import {
  AudioOutlined,
  AudioMutedOutlined,
  CloseCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import useZoom from "../hooks/useZoom";

const JoinRoom = () => {
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [room, setRoom] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [contextHolder, showFailure] = useNotification();
  const [join, leave] = useZoom(
    "self-view-video",
    "participant-videos-canvas",
    showVideo,
    isMuted
  );
  const navigate = useNavigate();

  useEffect(() => {
    const joinRoom = async () => {
      try {
        const room = await getRoom(id);
        setRoom(room);
        setShowForm(room.hasPasscode);
        if (!room.hasPasscode) {
          const { token, user } = await getRoomToken({
            name: room.name,
            identity: room.identity,
            passcode: null,
          });
          join(token, room.identity, user);
        }
      } catch (e) {
        showFailure({ title: "Failure", message: e.message });
      }
    };
    joinRoom();
  }, []);

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const toggleAudio = () => {
    setIsMuted(!isMuted);
  };

  const handleFormSubmission = async (form) => {
    const { passcode } = await form.validateFields();
    try {
      const { token, user } = await getRoomToken({
        identity: room.identity,
        passcode,
      });
      form.resetFields();
      setShowForm(false);
      join(token, room.identity, user);
    } catch (e) {
      showFailure({
        title: "Failed to join room",
        message: e.message,
      });
    }
  };

  const returnHome = () => {
    navigate("/");
  };

  return (
    <>
      {contextHolder}
      <ModalForm
        title="Passcode required to join this room"
        isVisible={showForm}
        handleFormSubmission={handleFormSubmission}
        handleCancel={returnHome}
      >
        <Form.Item
          name="passcode"
          label="Passcode"
          rules={[
            {
              required: true,
              message: "Please provide the room passcode",
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
      </ModalForm>
      <Row gutter={8}>
        <Col span={12}>
          <video id="self-view-video" width="240" height="145"></video>
        </Col>
        <Col span={12}>
          <canvas
            id="participant-videos-canvas"
            width="240"
            height="145"
          ></canvas>
        </Col>
        <Col span={24}>
          <Flex justify="space-evenly" align="center" vertical>
            <Divider orientationMargin={10} />
            <Flex gap="small" wrap="wrap">
              <Button
                shape="round"
                icon={showVideo ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                size="large"
                onClick={toggleVideo}
              />
              <Button
                shape="round"
                icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                size="large"
                onClick={toggleAudio}
              />
              <Button
                danger
                shape="round"
                icon={<CloseCircleOutlined />}
                size="large"
                onClick={async () => {
                  await leave();
                  returnHome();
                }}
              >
                Exit
              </Button>
            </Flex>
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default JoinRoom;

