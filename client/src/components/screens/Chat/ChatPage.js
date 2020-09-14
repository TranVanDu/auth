import React from 'react';
import { Row, Card, Col, Avatar, Space, Tabs } from 'antd';
import {
  SettingTwoTone,
  EditTwoTone,
  MessageOutlined,
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import ChatConversation from './ChatConversation';
import './ChatPage.scss';

const { TabPane } = Tabs;

export default function ChatPage() {
  return (
    <div className="chatPage">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col md={6}>
          <Card
            style={{ minHeight: 'calc(100vh - 110px)' }}
            title={
              <div>
                <Avatar src="https://photo-1-baomoi.zadn.vn/w1000_r1/2020_02_06_180_33882101/e01e378f00cce992b0dd.jpg" />
                {'   '}
                Madara
              </div>
            }
            extra={
              <Space size="middle">
                <SettingTwoTone style={{ fontSize: '16px' }} />
                <EditTwoTone />
              </Space>
            }
          >
            <Tabs defaultActiveKey="1" size="large">
              <TabPane
                tab={<MessageOutlined style={{ fontSize: '20px' }} />}
                key="1"
              >
                <ChatConversation />
              </TabPane>
              <TabPane
                tab={<UserOutlined style={{ fontSize: '20px' }} />}
                key="2"
              ></TabPane>
              <TabPane
                tab={<SearchOutlined style={{ fontSize: '20px' }} />}
                key="3"
              ></TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
