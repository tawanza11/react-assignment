import React from "react";
import { Button, Table, Space, Tag, Popconfirm, Modal, Form, Input } from "antd";
import { DeleteOutlined, BugOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axios from 'axios';  // เพิ่ม axios เข้ามาที่นี่

export default function TransactionList(props) {

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState(null);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  // ใช้ async/await ใน handleSave เพื่อจัดการการอัปเดตข้อมูลไปยัง Strapi
  const handleSave = async (values) => {
    try {
      // ส่งข้อมูลที่แก้ไขไปยัง Strapi API
      await axios.put(`http://localhost:1337/api/txactions/${editingRecord.id}`, {
        data: {
          action_datetime: values.action_datetime,
          type: values.type,
          amount: values.amount,
          note: values.note,
        }
      });

      // เมื่ออัปเดตสำเร็จ ให้ปิด modal
      setIsModalOpen(false);
      setEditingRecord(null);

      // เรียกฟังก์ชันที่ใช้ดึงข้อมูลใหม่จาก API เพื่อรีเฟรชข้อมูลในตาราง
      props.onDataRefreshed(); // เรียกฟังก์ชันจาก props เพื่อรีเฟรชข้อมูลใน table

    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const columns = [
    { 
      title: "Date-Time", 
      dataIndex: "action_datetime", 
      key: "action_datetime",
      render: (_, record) => dayjs(record.action_datetime).format("DD/MM/YYYY - HH:mm")
    },
    { 
      title: "Type", dataIndex: "type", key: "type", render: (_, record) => (
        <Tag color={record.type === "income" ? 'green' : 'red'}>{record.type}</Tag>
      ) 
    },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Action", key: "action", render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            shape="round" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} />
          
          <Popconfirm
            title="Delete the transaction"
            description="Are you sure to delete this transaction?"
            onConfirm={() => props.onRowDeleted(record.id)}
          >
            <Button danger 
              type="primary" 
              shape="circle" 
              icon={<DeleteOutlined />} />
          </Popconfirm>

          <Button 
            type="primary" 
            shape="circle" 
            icon={<BugOutlined />} 
            onClick={() => {
              Modal.info({
                title: "Debug",
                content: JSON.stringify(record)
              })
            }}/>
        </Space>
      ), 
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={props.data} rowKey="id" />
      
      {/* Modal for Editing */}
      <Modal
        title="Edit Transaction"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          const form = document.querySelector('#edit-form');
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }}
      >
        {editingRecord && (
          <Form
            id="edit-form"
            initialValues={{
              action_datetime: dayjs(editingRecord.action_datetime).format("YYYY-MM-DDTHH:mm"),
              type: editingRecord.type,
              amount: editingRecord.amount,
              note: editingRecord.note,
            }}
            onFinish={handleSave}
          >
            <Form.Item
              name="action_datetime"
              label="Date-Time"
              rules={[{ required: true, message: "Please input the date and time!" }]} >
              <Input type="datetime-local" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: "Please select a type!" }]} >
              <Input />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: "Please input the amount!" }]} >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="note"
              label="Note" >
              <Input.TextArea />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
}
