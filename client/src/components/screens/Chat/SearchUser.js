import React, { useState } from 'react';
import { Input, List, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import api from '../../../api/index';

const { Search } = Input;

function SearchUser(props) {
    const [users, setUsers] = useState([]);
    const user = useSelector((state) => state.user.user);
    const [fetching, setFetching] = useState(false);

    const onSearch = debounce((value) => {
        if (value) {
            setFetching(true);
            api.get('api/users/search-users', {
                params: { name: value },
            }).then((res) => {
                let data = res.data.data.users.filter((item, index) => {
                    return item._id !== user._id;
                });

                setUsers(data);
                setFetching(false);
            });
        } else {
            setUsers([]);
        }
    }, 1000);

    const checkExitsConversation = (data) => {
        api.post('api/chat/check/exist-conversation', { id: data._id })
            .then((res) => {
                if (res.data?.data?.conversation) {
                    let item = res.data.data.conversation;
                    const conversation = {
                        id: item._id,
                        url:
                            user._id !== item.userId._id
                                ? item.userId.avatar
                                : item.contactId.avatar,
                        name:
                            user._id !== item.userId._id
                                ? item.userId.name
                                : item.contactId.name,
                        ...item,
                    };

                    props.onDetail(conversation);
                }
            })
            .catch(() => {
                const conversation = {
                    userId: data._id,
                    url: data.avatar,
                    name: data.name,
                };
                props.onDetail(conversation);
            });
    };

    return (
        <div>
            <Search
                size="large"
                prefix={<UserOutlined />}
                placeholder="input search text"
                onSearch={(value) => onSearch(value)}
            />
            <div style={{ marginTop: '20px' }}>
                {fetching ? (
                    <Spin />
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={users}
                        renderItem={(item) => {
                            return (
                                <List.Item
                                    style={{
                                        cursor: 'pointer',
                                        padding: '10px',
                                    }}
                                    onClick={() => {
                                        // this.props.onDetail(item);

                                        checkExitsConversation(item);
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} />}
                                        title={item.name}
                                    />
                                </List.Item>
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default SearchUser;
