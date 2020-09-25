import React from 'react';
import moment from 'moment';

function MessageItem({ messages, userId }) {
    return (
        <div style={{ padding: '10px' }}>
            {messages.map((message, i) => {
                const time = moment(messages[i].createdAt);
                const id = message.sender._id;
                let next_message = messages[i + 1] ? messages[i + 1] : null;
                let id1 = next_message ? next_message.sender._id : null;
                let x = next_message ? next_message.createdAt : Date.now();

                const new_time = moment(x);
                const old_time =
                    i > 0 ? moment(messages[i - 1].createdAt) : time;

                const diff_time = time.diff(old_time, 'minutes');
                const diff = new_time.diff(time, 'minutes');
                const now = moment(Date.now())
                    .startOf('day')
                    .format('YYYY-MM-DD');
                const diff_day = time.format('YYYY-MM-DD') === now;

                return (
                    <div key={i} style={{ position: 'relative' }}>
                        {i === 0 && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                }}
                            >
                                {time.format('dddd ')}
                                on
                                {time.format(' HH:mm')}
                            </div>
                        )}

                        {i !== 0 && !diff_day && diff > 30 && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                }}
                            >
                                {time.format('dddd ')}
                                on
                                {time.format(' HH:mm')}
                            </div>
                        )}

                        {i !== 0 && diff_time > 30 && diff_day && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                }}
                            >
                                {time.format('HH:mm')}
                            </div>
                        )}

                        <div
                            className={
                                userId === message.sender?._id
                                    ? ' ownMessages'
                                    : 'otherMessages'
                            }
                            style={
                                id !== id1
                                    ? { marginBottom: '10px' }
                                    : diff < 3
                                    ? {}
                                    : { marginBottom: '10px' }
                            }
                        >
                            <div
                                className={
                                    userId === message.sender?._id
                                        ? 'message ownMessage'
                                        : 'message '
                                }
                            >
                                {message.message}
                            </div>
                        </div>
                        <div style={{ position: 'absolute', bottom: '0' }}>
                            {diff > 3 ? (
                                userId !== message.sender?._id ? (
                                    <img
                                        src={message.sender.avatar}
                                        alt=""
                                        style={{
                                            height: '20px',
                                            width: '20px',
                                            borderRadius: '50%',
                                        }}
                                    />
                                ) : null
                            ) : id !== id1 ? (
                                userId !== message.sender?._id ? (
                                    <img
                                        src={message.sender.avatar}
                                        alt=""
                                        style={{
                                            height: '20px',
                                            width: '20px',
                                            borderRadius: '50%',
                                        }}
                                    />
                                ) : null
                            ) : null}
                        </div>
                    </div>
                );
            })}
            {messages.length === 0 ? (
                <div>Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện</div>
            ) : null}
        </div>
    );
}

export default MessageItem;
