import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { List, Avatar, Badge } from 'antd';
import { connect } from 'react-redux';
import { getConversations } from '../../../actions/ChatActions';
import moment from 'moment';
import Truncate from 'react-truncate';
import InfiniteScroll from 'react-infinite-scroller';

class ChatConversation extends Component {
    // static propTypes = {
    //   prop: PropTypes,
    // };
    state = {
        chat: [],
        isLoading: false,
        hasMore: true,
    };

    async componentDidMount() {
        let data = await this.props.getConversations();
        this.setState({
            chat: data.data.conversations,
        });
    }

    render() {
        const { user } = this.props;
        const { isLoading, hasMore, chat } = this.state;

        const conversations = chat.map((item) => {
            return {
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
        });

        return (
            <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                // loadMore={this.handleInfiniteOnLoad}
                hasMore={!isLoading && hasMore}
                useWindow={false}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={conversations}
                    renderItem={(item) => (
                        <List.Item
                            style={{ cursor: 'pointer', padding: '10px' }}
                            onClick={() => {
                                this.props.onDetail(item);
                            }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.url} />}
                                title={item.name}
                                description={
                                    <div>
                                        <div>
                                            <b>
                                                {user._id ===
                                                item.lastest_chat.sender._id
                                                    ? 'bạn: '
                                                    : `${item.lastest_chat.sender.name}: `}
                                            </b>
                                            <Truncate
                                                lines={1}
                                                ellipsis={'...'}
                                                width={100}
                                            >
                                                {item.lastest_chat.message}
                                            </Truncate>
                                        </div>
                                        <span style={{ fontSize: '12px' }}>
                                            {moment(
                                                item.lastest_chat.createdAt
                                            ).format('DD/MM/YYYY HH:mm')}
                                        </span>
                                    </div>
                                }
                            />
                            {user._id === item.lastest_chat.sender._id ||
                            item.lastest_chat.is_read ? null : (
                                <Badge
                                    dot
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                    }}
                                />
                            )}
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        // chat: state.chat,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getConversations: () => dispatch(getConversations()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversation);
