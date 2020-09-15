import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Avatar } from 'antd';
import moment from 'moment';
import Truncate from 'react-truncate';
import InfiniteScroll from 'react-infinite-scroller';

export default class ChatConversation extends Component {
  static propTypes = {
    prop: PropTypes,
  };

  render() {
    const data = [
      {
        id: 1,
        name: 'Ant Design Title 1',
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        id: 2,
        name: 'Ant Design Title 2',
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        id: 3,
        name: 'Ant Design Title 3',
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },

      {
        id: 4,
        name: 'Ant Design Title 4',
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ];
    return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: 'pointer' }}
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
                    <b>madara: </b>
                    <Truncate lines={1} ellipsis={'...'} width={100}>
                      Ant Design, a design language for background applications,
                      is refined by Ant UED Team
                    </Truncate>
                  </div>
                  <span style={{ fontSize: '12px' }}>
                    {moment().format('DD/MM/YYYY HH:mm')}
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  }
}
