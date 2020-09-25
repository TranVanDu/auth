import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { List, Avatar, Badge, Spin, Popover } from 'antd';
import { connect } from 'react-redux';
import {
    getConversations,
    deleteConversation,
} from '../../../actions/ChatActions';
import moment from 'moment';
import { getSocket } from '../../../socket';
import { DeleteOutlined } from '@ant-design/icons';
import Truncate from 'react-truncate';
import InfiniteScroll from 'react-infinite-scroller';
import { toast } from 'react-toastify';

class ChatConversation extends Component {
    // static propTypes = {
    //   prop: PropTypes,
    // };

    _isMounted = false;
    state = {
        chat: [],
        isLoading: false,
        hasMore: true,
        page: 0,
        total: 0,
        total_page: 0,
    };

    async componentDidMount() {
        this._isMounted = true;
        let data = await this.props.getConversations();
        if (this._isMounted) {
            let more = data.data.page < data.data.total_page ? true : false;
            this.setState({
                chat: data.data.conversations,
                page: data.data.page,
                hasMore: more,
                total: data.data.total,
                total_page: data.data.total_page,
            });
            if (this.state.chat.length > 0) {
                if (getSocket()) {
                    getSocket().on('res-last-message', (data) => {
                        if (data) {
                            let chat = [...this.state.chat];
                            let index = this.state.chat.findIndex(
                                (item, index) => {
                                    return (
                                        item._id.toString() ===
                                        data.conversationId.toString()
                                    );
                                }
                            );

                            chat[index] = {
                                ...chat[index],
                                lastest_chat: data,
                            };

                            this.setState({
                                ...this.state,
                                chat: chat,
                            });
                        }
                    });
                }
            }
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.load === true && this.props.load !== prevProps.load) {
            let data = await this.props.getConversations();
            if (data) {
                this.props.setLoading(false);
                this.setState({
                    ...this.state,
                    chat: data.data.conversations,
                });
            }
        }
    }

    handleInfiniteOnLoad = () => {
        if (this.state.page === this.state.total_page) {
            toast.success(
                'Toàn bộ cuộc trò chuyện trên hệ thống đã được hiển thị!'
            );

            this.setState({
                hasMore: false,
            });

            return;
        } else {
            this.props
                .getConversationDetails(this.props.item.id, {
                    page: this.state.page + 1,
                })
                .then((res) => {
                    setTimeout(() => {
                        this.setState({
                            message: [
                                ...res.data.conversation.message,
                                ...this.state.message,
                            ],
                            page: res.data.pagination.page,
                        });
                    }, 3000);
                });
        }
    };

    onDeleteConversation = async (id) => {
        try {
            await this.props.deleteConversation([id]);
            let conversation = this.state.chat.filter((item, index) => {
                return item._id.toString() !== id.toString();
            });
            console.log(conversation);
            this.setState({
                ...this.state,
                chat: conversation,
            });
        } catch (error) {
            console.log(error);
        }
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { user } = this.props;
        const { hasMore, chat } = this.state;

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
                loadMore={this.handleInfiniteOnLoad}
                hasMore={hasMore}
                useWindow={false}
                loader={<Spin key={0} style={{ textAlign: 'center' }} />}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={conversations}
                    renderItem={(item) => {
                        let now = moment();
                        let duration = moment.duration(
                            now.diff(moment(item.lastest_chat.createdAt))
                        );
                        let hours = Math.ceil(duration.asHours());
                        let minutes = Math.ceil(duration.asMinutes());
                        let date = moment(item.lastest_chat.createdAt).format(
                            'DD/MM/YYYY'
                        );
                        if (hours <= 23) date = `${hours} giờ trước`;
                        if (minutes < 60) date = `${minutes} phút trước`;

                        return (
                            <List.Item
                                style={{ cursor: 'pointer', padding: '10px' }}
                                actions={[
                                    <Popover content="Xóa cuộc trò chuyện">
                                        <DeleteOutlined
                                            onClick={() =>
                                                this.onDeleteConversation(
                                                    item._id
                                                )
                                            }
                                        />
                                    </Popover>,
                                ]}
                            >
                                <List.Item.Meta
                                    onClick={() => {
                                        this.props.onDetail(item);
                                    }}
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
                                                {date}
                                            </span>
                                        </div>
                                    }
                                />

                                {user._id === item.lastest_chat.sender._id ||
                                item.lastest_chat.is_read.toString() ===
                                    'true' ? (
                                    <div />
                                ) : (
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
                        );
                    }}
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
        deleteConversation: (data) => dispatch(deleteConversation(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversation);
