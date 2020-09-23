import React, { Component } from 'react';
import { Spin, Card, Avatar, Space } from 'antd';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import { getSocket } from '../../../socket';
import {
    getConversationDetails,
    createMessage,
} from '../../../actions/ChatActions';
import MessageItem from './MessageItem';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

class ChatMessage extends Component {
    // constructor(props) {
    //     super(props);
    //     this._debounceHandle = _.debounce(this.handleInfiniteOnLoad, 300);
    // }
    static propTypes = {
        item: PropTypes.shape({
            id: PropTypes.string,
            url: PropTypes.string,
            name: PropTypes.string.isRequired,
        }),
    };

    ref = React.createRef();

    static defaultProps = {
        item: {
            url:
                'https://photo-1-baomoi.zadn.vn/w1000_r1/2020_02_06_180_33882101/e01e378f00cce992b0dd.jpg',
            name: 'Madara',
        },
    };

    state = {
        isLoading: true,
        value: '',
        message: [],
        hasMore: true,
        page: 0,
        total: 0,
        total_page: 0,
        width: window.innerWidth,
    };

    handleResize = (e) => {
        this.setState({ width: window.innerWidth });
    };

    async componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        let message = await this.props.getConversationDetails(
            this.props.item.id
        );

        if (message) {
            let more =
                message.data.pagination.page ===
                message.data.pagination.total_page
                    ? false
                    : true;
            this.setState({
                isLoading: false,
                hasMore: more,
                message: message.data.conversation.message,
                total: message.data.pagination.total,
                page: message.data.pagination.page,
                total_page: message.data.pagination.total_page,
            });

            this.ref.current.scrollToBottom();
        }

        getSocket().on('res-send-message', (data) => {
            if (
                data.conversationId.toString() ===
                    this.props.item.id.toString() &&
                data.sender._id !== this.props.user._id
            ) {
                this.setState({
                    message: [...this.state.message, data],
                    total: this.state.total + 1,
                });
                this.ref.current.scrollToBottom();
            }
        });
    }

    handleInfiniteOnLoad = () => {
        console.log(this.state.page, this.state.total_page);
        if (this.state.page === this.state.total_page) {
            toast.success(
                'Toàn bộ cuộc trò chuyện trên hệ thống đã được hiển thị!'
            );

            this.setState({
                hasMore: false,
            });

            return;
        } else {
            console.log('api');
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

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //   if (nextProps.id !== this.props.id) {
    //     this.setState({
    //       ...this.state,
    //       isLoading: true,
    //     });
    //     //gọi api=>set state

    //     setTimeout(() => {
    //       this.setState({
    //         ...this.state,
    //         isLoading: false,
    //       });
    //     });
    //   }
    // }

    static getDerivedStateFromProps(props, state) {
        if (props.item.id !== state.id) {
            return {
                ...state,
                isLoading: true,
                id: props.item.id,
                value: '',
            };
        }
        return null;
    }

    onChangeValue = (e) => {
        this.setState({
            ...this.state,
            value: e.target.value,
        });
    };

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.item.id !== prevProps.item.id) {
            let message = await this.props.getConversationDetails(
                this.props.item.id
            );

            if (message) {
                let more =
                    message.data.pagination.page ===
                    message.data.pagination.total_page
                        ? false
                        : true;
                this.setState({
                    message: message.data.conversation.message,
                    isLoading: false,
                    hasMore: more,
                    page: message.data.pagination.page,
                    total: message.data.pagination.total,
                    total_page: message.data.pagination.total_page,
                });
                if (this.ref.current) {
                    this.ref.current.scrollToBottom();
                }
            }
        }
    }

    sendMessage = async (e) => {
        e.preventDefault();
        let data = this.state.value;
        let id = this.state.id;
        let message = await this.props.createMessage(id, {
            message: data,
            conversationType: 'Conversation',
        });

        if (message) {
            this.setState({
                ...this.state,
                message: [
                    ...this.state.message,
                    message.data.conversation.message,
                ],
                value: '',
                total: this.state.total + 1,
            });
            this.ref.current.scrollToBottom();
        }
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        const { user } = this.props;
        const { message, hasMore } = this.state;

        return (
            <Card
                style={{
                    minHeight: 'calc(100vh - 110px)',
                    position: 'relative',
                }}
                title={
                    <div>
                        <Avatar
                            src={this.props.item.url}
                            style={{ marginRight: '10px' }}
                        />
                        {this.props.item.name}
                    </div>
                }
                extra={
                    <Space size="middle">
                        {this.state.width < 768 ? (
                            <UserOutlined
                                onClick={this.props.onDawerConversation}
                            />
                        ) : null}

                        {this.state.width < 992 ? (
                            <ExclamationCircleOutlined
                                onClick={this.props.onDawerInfo}
                            />
                        ) : null}
                    </Space>
                }
            >
                {this.state.isLoading ? (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                        }}
                    >
                        <Spin />
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="messages">
                            <Scrollbars
                                ref={this.ref}
                                autoHeight
                                autoHeightMin={'calc(100vh - 250px)'}
                                autoHide
                            >
                                <InfiniteScroll
                                    isReverse={true}
                                    initialLoad={false}
                                    pageStart={1}
                                    loadMore={this.handleInfiniteOnLoad}
                                    hasMore={hasMore}
                                    useWindow={false}
                                    loader={<Spin key={0} />}
                                >
                                    <MessageItem
                                        messages={message}
                                        userId={user._id}
                                    />
                                </InfiniteScroll>
                            </Scrollbars>

                            {/* {message.length > 0 &&
                                message.map((item, index) => {
                                    return (
                                        <MessageItem
                                            key={index}
                                            message={item}
                                        />
                                    );
                                })} */}
                        </div>
                        <form
                            className="sendMessage"
                            onSubmit={this.sendMessage}
                        >
                            <div className="sendMessage__form">
                                <input
                                    className="sendMessage__input"
                                    placeholder="Nhập tin nhắn"
                                    name="message"
                                    value={this.state.value}
                                    onChange={this.onChangeValue}
                                />
                            </div>

                            <button
                                className="sendMessage__button"
                                type="submit"
                            >
                                Gửi
                            </button>
                        </form>
                    </React.Fragment>
                )}
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getConversationDetails: (id, data) =>
            dispatch(getConversationDetails(id, data)),
        createMessage: (id, data) => dispatch(createMessage(id, data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessage);
