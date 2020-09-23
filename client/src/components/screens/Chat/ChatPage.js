import React, { useState } from 'react';
import { Row, Card, Col, Avatar, Space, Tabs, Button, Drawer } from 'antd';
import {
    SettingTwoTone,
    EditTwoTone,
    MessageOutlined,
    UserOutlined,
    SearchOutlined,
    ExclamationCircleOutlined,
    WechatOutlined,
} from '@ant-design/icons';
import ChatConversation from './ChatConversation';
import ChatMessage from './ChatMessage';
import useWindowDimensions from '../../SharedComponent/useWindowSize';
import './ChatPage.scss';

const { TabPane } = Tabs;

export default function ChatPage() {
    // const [mount, setMount] = useState(true);

    const [conversation, setConversation] = useState({});
    const [visible, setVisible] = useState(false);
    const [visibleCoversation, setVisibleConversation] = useState(false);

    const { width } = useWindowDimensions();

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const showDrawerConversation = () => {
        setVisibleConversation(true);
    };

    const onCloseConversation = () => {
        setVisibleConversation(false);
    };

    const onDetail = (item) => {
        // setMount(false);
        setConversation(item);
    };

    return (
        <div className="chatPage">
            <Row gutter={{ xs: 0, sm: 0, md: 0, lg: 0 }}>
                <Col lg={6} md={9} xs={0}>
                    <Card
                        style={{ minHeight: 'calc(100vh - 110px)' }}
                        title={
                            <div>
                                <Avatar src="https://photo-1-baomoi.zadn.vn/w1000_r1/2020_02_06_180_33882101/e01e378f00cce992b0dd.jpg" />
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
                                tab={
                                    <MessageOutlined
                                        style={{ fontSize: '20px' }}
                                    />
                                }
                                key="1"
                            >
                                <ChatConversation onDetail={onDetail} />
                            </TabPane>
                            <TabPane
                                tab={
                                    <UserOutlined
                                        style={{ fontSize: '20px' }}
                                    />
                                }
                                key="2"
                            ></TabPane>
                            <TabPane
                                tab={
                                    <SearchOutlined
                                        style={{ fontSize: '20px' }}
                                    />
                                }
                                key="3"
                            ></TabPane>
                        </Tabs>
                    </Card>
                </Col>

                <Col lg={12} md={15} xs={24}>
                    {!conversation.id ? (
                        <Card
                            style={{ minHeight: 'calc(100vh - 110px)' }}
                            // title={
                            //   <div>
                            //     <Avatar src="https://photo-1-baomoi.zadn.vn/w1000_r1/2020_02_06_180_33882101/e01e378f00cce992b0dd.jpg" />
                            //     {'   '}
                            //     Madara
                            //   </div>
                            // }
                            extra={
                                width < 992 ? (
                                    <Space size="middle">
                                        {width < 768 ? (
                                            <UserOutlined
                                                onClick={showDrawerConversation}
                                            />
                                        ) : null}

                                        <ExclamationCircleOutlined
                                            onClick={showDrawer}
                                        />
                                    </Space>
                                ) : null
                            }
                        >
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop: '200px',
                                }}
                            >
                                <div>
                                    <WechatOutlined
                                        style={{
                                            fontSize: '80px',
                                            color: '#c3226e',
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                    }}
                                >
                                    Tin nhắn của bạn
                                </div>
                                <div style={{ fontSize: '16px' }}>
                                    Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc
                                    nhóm.
                                </div>
                                <Button style={{ marginTop: '10px' }}>
                                    Gửi ngay
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <ChatMessage
                            item={conversation}
                            onDawerConversation={showDrawerConversation}
                            onDawerInfo={showDrawer}
                        />
                    )}
                </Col>
                <Col lg={6} md={0} xs={0}>
                    <Card
                        style={{ minHeight: 'calc(100vh - 110px)' }}
                        title={'thông tin'}
                        extra={
                            <Space size="middle">
                                <ExclamationCircleOutlined />
                            </Space>
                        }
                    ></Card>
                </Col>
            </Row>
            <Drawer closable={false} onClose={onClose} visible={visible}>
                <Card
                    style={{ minHeight: 'calc(100vh)', padding: '0px' }}
                    title={'thông tin'}
                    extra={
                        <Space size="middle">
                            <ExclamationCircleOutlined />
                        </Space>
                    }
                ></Card>
            </Drawer>
            <Drawer
                closable={false}
                onClose={onCloseConversation}
                visible={visibleCoversation}
            >
                <Card
                    style={{ minHeight: 'calc(100vh - 110px)' }}
                    title={
                        <div>
                            <Avatar src="https://photo-1-baomoi.zadn.vn/w1000_r1/2020_02_06_180_33882101/e01e378f00cce992b0dd.jpg" />
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
                            tab={
                                <MessageOutlined style={{ fontSize: '20px' }} />
                            }
                            key="1"
                        >
                            <ChatConversation onDetail={onDetail} />
                        </TabPane>
                        <TabPane
                            tab={<UserOutlined style={{ fontSize: '20px' }} />}
                            key="2"
                        ></TabPane>
                        <TabPane
                            tab={
                                <SearchOutlined style={{ fontSize: '20px' }} />
                            }
                            key="3"
                        ></TabPane>
                    </Tabs>
                </Card>
            </Drawer>
        </div>
    );
}
