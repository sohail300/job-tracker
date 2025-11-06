import { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Table, Form, Space, Empty, message } from "antd";
import { Plus, Edit3, Trash2, FileText } from "lucide-react";
import { templatesAPI } from "../services/api";

const Templates = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setIsModalOpen(true);
  };

  // values are applied after modal fully opens

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await templatesAPI.getAll();
      setItems(data);
    } catch (e) {
      message.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await templatesAPI.update(editing._id, values);
        message.success("Template updated");
      } else {
        await templatesAPI.create(values);
        message.success("Template created");
      }
      closeModal();
      fetchAll();
    } catch (e) {
      // validation errors already shown; api errors -> toast
      if (e?.response?.data?.detail) {
        message.error(e.response.data.detail);
      }
    }
  };

  const handleDelete = async (record) => {
    try {
      await templatesAPI.delete(record._id);
      message.success("Template deleted");
      fetchAll();
    } catch (e) {
      message.error("Failed to delete");
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">{text}</span>
        ),
      },
      {
        title: "Date of Creation",
        key: "created_at",
        render: (_, r) => (
          <span className="text-gray-500 dark:text-gray-400">
            {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
          </span>
        ),
        responsive: ["sm"],
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button type="text" onClick={() => openEdit(record)} icon={<Edit3 className="h-4 w-4" />}>
              Edit
            </Button>
            <Button danger type="text" onClick={() => handleDelete(record)} icon={<Trash2 className="h-4 w-4" />}>
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Templates</h1>
        </div>
        <Button type="primary" onClick={openCreate} icon={<Plus className="h-4 w-4" />}>
          New Template
        </Button>
      </div>

      <div className="card">
        <Table
          dataSource={items}
          columns={columns}
          loading={loading}
          rowKey={(r) => r._id}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="No templates yet" /> }}
          className="overflow-x-auto"
        />
      </div>

      <Modal
        title={editing ? "Edit Template" : "Create Template"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText={editing ? "Save" : "Create"}
        destroyOnClose
        afterOpenChange={(open) => {
          if (open) {
            if (editing) {
              form.setFieldsValue({
                name: editing.name || "",
                subject: editing.subject || "",
                body: editing.body || "",
              });
            } else {
              form.resetFields();
            }
          }
        }}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="Email Template" allowClear />
          </Form.Item>
          <Form.Item label="Subject" name="subject">
            <Input placeholder="Subject" allowClear />
          </Form.Item>
          <Form.Item label="Body" name="body">
            <Input.TextArea rows={6} placeholder="Body" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Templates;


