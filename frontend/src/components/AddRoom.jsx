import { Form, Input } from "antd";
import { createRoom } from "../Api";
import ModalForm from "./ModalForm";

const sanitizePasscode = (input) => {
  if (input && input !== "") return input;
  return null;
};

const AddRoom = ({ onAddition, onError, isVisible, setVisibility }) => {
  const handleFormSubmission = async (form) => {
    try {
      const { name, passcode } = await form.validateFields();
      const newRoom = await createRoom({
        name,
        passcode: sanitizePasscode(passcode),
      });
      onAddition(newRoom);
      form.resetFields();
      setVisibility(false);
    } catch (error) {
      onError(error.message);
    }
  };

  return (
    <ModalForm
      title="Add new room"
      isVisible={isVisible}
      handleFormSubmission={handleFormSubmission}
      handleCancel={() => setVisibility(false)}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please provide the name of the room",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="passcode"
        label="Passcode"
        rules={[
          { type: "string", whitespace: true },
          { min: 5, message: "Passcode must be at least 5 characters" },
          { whitespace: false },
        ]}
      >
        <Input.Password />
      </Form.Item>
    </ModalForm>
  );
};

export default AddRoom;

