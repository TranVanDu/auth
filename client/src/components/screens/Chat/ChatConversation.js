import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Avatar } from 'antd';
import moment from 'moment';
import Truncate from 'react-truncate';

export default class ChatConversation extends Component {
  static propTypes = {
    prop: PropTypes,
  };

  render() {
    const data = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },
      {
        title: 'Ant Design Title 3',
      },
      {
        title: 'Ant Design Title 4',
      },
    ];
    return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={<a href="https://ant.design">{item.title}</a>}
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
