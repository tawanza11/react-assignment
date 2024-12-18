import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  MenuOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import FinanceScreen from './FinanceScreen';

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
  getItem('Menu','0', <MenuOutlined/>,[
  getItem('TABLE', '1', <PieChartOutlined />),
  getItem('Chart', '2', <DesktopOutlined />),
  ]),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Profile', '3'),
    getItem('Logout', '4'),
  ]),
];

const UI = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1'); // State เก็บเมนูที่เลือก
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={({ key }) => setSelectedMenu(key)} // เปลี่ยน state เมื่อเลือกเมนู
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '16px', padding: '10px', background: colorBgContainer }}>
          <Breadcrumb style={{ marginBottom: '16px' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedMenu === '1' ? 'Option 1' : 'Other'}</Breadcrumb.Item>
          </Breadcrumb>
          
          {/* แสดง Table เมื่อเลือก Option 1 */}
          {selectedMenu === '1' ? (
            <FinanceScreen />
          ) : (
            <div>กรุณาเลือกเมนูอื่น</div>
          )}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
        Created by 6710110298
        </Footer>
      </Layout>
    </Layout>
  );
};

export default UI;
