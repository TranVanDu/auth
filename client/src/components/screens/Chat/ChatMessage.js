import React, { Component } from 'react';
import { Spin, Card, Avatar, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
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

class ChatMessage extends Component {
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
        loading: false,
        hasMore: true,
    };

    async componentDidMount() {
        let message = await this.props.getConversationDetails(
            this.props.item.id
        );

        if (message) {
            this.setState({
                isLoading: false,
                message: message.data.conversation.message,
            });

            this.ref.current.scrollToBottom();
        }

        getSocket().on('res-send-message', (data) => {
            console.log(data);
            if (
                data.conversationId.toString() ===
                    this.props.item.id.toString() &&
                data.sender._id !== this.props.user._id
            ) {
                this.setState({
                    message: [...this.state.message, data],
                });
                this.ref.current.scrollToBottom();
            }
        });
    }

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
                this.setState({
                    isLoading: false,
                    message: message.data.conversation.message,
                });
                this.ref.current.scrollToBottom();
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
            });
            this.ref.current.scrollToBottom();
        }
    };

    render() {
        const { user } = this.props;
        const { message, loading, hasMore } = this.state;
        // console.log(this.state.value, this.state.id);
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
                        <ExclamationCircleOutlined />
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
                            <InfiniteScroll
                                initialLoad={false}
                                pageStart={0}
                                // loadMore={this.handleInfiniteOnLoad}
                                hasMore={!loading && hasMore}
                                useWindow={false}
                            >
                                <Scrollbars
                                    ref={this.ref}
                                    autoHeight
                                    autoHeightMin={'calc(100vh - 250px)'}
                                    autoHide
                                >
                                    <MessageItem
                                        messages={message}
                                        userId={user._id}
                                    />
                                </Scrollbars>
                            </InfiniteScroll>
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
        getConversationDetails: (id) => dispatch(getConversationDetails(id)),
        createMessage: (id, data) => dispatch(createMessage(id, data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessage);
