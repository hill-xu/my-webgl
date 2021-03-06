import React from 'react';
import { Layout, Menu } from 'antd';
import {
  Link
} from "react-router-dom";
const { Content, Sider } = Layout;
class MyLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Link to="/demo1">点击画原点</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/demo2">星星向你眨眼睛</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/demo3">绘制点、线、面</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/demo4">画单线</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/demo5">画多线</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/demo6">狮子座</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            { this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default MyLayout