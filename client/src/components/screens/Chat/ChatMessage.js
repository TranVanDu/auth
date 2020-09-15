import React, { Component } from 'react';
import { Spin, Card, Avatar, Space } from 'antd';
import { ExclamationCircleOutlined, SendOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

export default class ChatMessage extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  };

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
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 1000);
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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.item.id !== prevProps.item.id) {
      // setTimeout(() => {});
      setTimeout(() => {
        this.setState({
          ...this.state,
          isLoading: false,
        });
      }, 1000);
    }
  }

  render() {
    return (
      <Card
        style={{ minHeight: 'calc(100vh - 110px)', position: 'relative' }}
        title={
          <div>
            <Avatar src={this.props.item.url} />
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
            <div className="messages"></div>
            <div className="sendMessage">
              <form className="sendMessage__form">
                <input
                  className="sendMessage__input"
                  name="message"
                  value={this.state.value}
                  onChange={this.onChangeValue}
                />
              </form>

              <button className="sendMessage__button">Gửi</button>
            </div>
          </React.Fragment>
        )}
      </Card>
    );
  }
}
