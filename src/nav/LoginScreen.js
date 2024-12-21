import { useState, useEffect } from "react";
import { Button, Form, Input, Alert, Checkbox } from "antd";
import axios from "axios";
import "../App.css";
const URL_AUTH = "/api/auth/local";

export default function LoginScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // ตรวจสอบ localStorage หากมีข้อมูล JWT เมื่อโหลดครั้งแรก
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      props.onLoginSuccess(); // แจ้งให้ App รู้ว่าผู้ใช้ล็อกอินแล้ว
    }
  }, [props]);

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true);
      setErrMsg(null);
      const response = await axios.post(URL_AUTH, { ...formData });
      const token = response.data.jwt;

      // ถ้าผู้ใช้เลือกให้จำข้อมูล, เก็บ token ใน localStorage
      if (rememberMe) {
        localStorage.setItem("token", token);
      }

      // กำหนดค่า Authorization ใน axios
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };

      props.onLoginSuccess();
    } catch (err) {
      console.log(err);
      setErrMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App-header">
      <img src="/giphy.webp" alt="Logo" className="login-logo" />
      <Form onFinish={handleLogin} autoComplete="off">
        {errMsg && (
          <Form.Item>
            <Alert message={errMsg} type="ERROR" />
          </Form.Item>
        )}

        <Form.Item
          label="Username"
          name="identifier"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        {/* ปุ่ม Remember Me */}
        <Form.Item>
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Remember me
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
