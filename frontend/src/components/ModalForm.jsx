import { Form, Modal } from "antd";
const ModalForm = ({
  title,
  isVisible,
  handleFormSubmission,
  handleCancel,
  children,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={title}
      centered
      open={isVisible}
      onOk={() => {
        handleFormSubmission(form);
      }}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        {children}
      </Form>
    </Modal>
  );
};

export default ModalForm;
