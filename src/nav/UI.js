import React, { useState } from "react";
import {
  DesktopOutlined,
  MenuOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import FinanceScreen from "./FinanceScreen";
import MyChart from "./chart";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Menu", "0", <MenuOutlined />, [
    getItem("TABLE", "1", <PieChartOutlined />),
    getItem("Chart", "2", <DesktopOutlined />),
  ]),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Profile", "3"),
    getItem("Logout", "4"),
  ]),
];

const UI = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("0"); // State เก็บเมนูที่เลือก
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleMenuClick = ({ key }) => {
    if (key === "4") {
      // การจัดการ Logout
      console.log("Logging out...");
      localStorage.removeItem("token"); // ลบ token หรือข้อมูล session
      window.location.href = "/login"; // เปลี่ยนเส้นทางไปยังหน้า Login
    } else {
      setSelectedMenu(key); // อัปเดตเมนูที่เลือก
    }
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content
          style={{
            margin: "16px",
            padding: "24px",
            background: colorBgContainer,
          }}
        >
          <Breadcrumb style={{ marginBottom: "16px" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>
              {selectedMenu === "1"
                ? "TABLE"
                : selectedMenu === "2"
                ? "Chart"
                : "Other"}
            </Breadcrumb.Item>
          </Breadcrumb>

          {/* แสดง Table เมื่อเลือก Option 1 */}
          {selectedMenu === "1" ? (
            <FinanceScreen />
          ) : selectedMenu === "2" ? (
            <MyChart />
          ) : (
            <div>กรุณาเลือกเมนูอื่น</div>
          )}
        </Content>
        <Footer style={{ textAlign: "center" }}>Created by 6710110298</Footer>
      </Layout>
    </Layout>
  );
};

export default UI;
