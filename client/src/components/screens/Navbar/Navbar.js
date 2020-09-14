import React, { useState } from 'react';
import RightMenu from './sections/RigthMenu';
import { MenuFoldOutlined } from '@ant-design/icons';
import { Drawer, Button, Select, Spin, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
// import qs from "qs";
import api from '../../../api/index';
import './Navbar.css';
const { Option } = Select;

const avatarDefault =
  'https://images.unsplash.com/photo-1440589473619-3cde28941638?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';

function NavBar() {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState(undefined);
  const [fetching, setFetching] = useState(false);
  const user = useSelector((state) => state.user);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onChange = (value) => {
    setValue(value);
  };
  const onSelect = (value) => {
    history.push(
      user.user._id === value.key ? '/profile' : `/user/${value.key}`
    );
    setValue(undefined);
    setData([]);
  };
  const onSearch = debounce((value) => {
    if (value) {
      setFetching(true);
      api
        .get('api/users/search-users', { params: { name: value } })
        .then((res) => {
          setData(res.data.data.users);
          setFetching(false);
        });
    } else {
      setData([]);
    }
  }, 500);

  return (
    <nav
      className="menu"
      style={{ position: 'fixed', zIndex: 5, width: '100%' }}
    >
      <div className="menu__logo">
        <Link to={user.isAuth ? '/' : '/login'}>APP</Link>
      </div>

      <div className="menu__search">
        {/* <Search
                    size="small"
                    placeholder="input search text"
                    onSearch={(value) => onSearch()}
                /> */}
        {user.user._id ? (
          <Select
            allowClear={true}
            showSearch
            filterOption={false}
            suffixIcon={<SearchOutlined />}
            labelInValue
            value={value}
            optionLabelProp="label"
            placeholder="Tìm kiếm users"
            notFoundContent={fetching ? <Spin size="small" /> : null}
            onSearch={onSearch}
            onChange={onChange}
            onSelect={(value) => onSelect(value)}
          >
            {data.length > 0
              ? data.map((item) => (
                  <Option key={item._id} value={item._id} label={item.name}>
                    <div style={{ display: 'flex' }}>
                      <Avatar src={item.avatar} alt="user_search" />
                      <div style={{ marginLeft: '20px' }}>{item.name}</div>
                    </div>
                  </Option>
                ))
              : null}
          </Select>
        ) : null}
      </div>

      <div className="menu__container">
        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <MenuFoldOutlined />
        </Button>

        <Drawer
          title={
            <div
              style={{ display: 'flex', cursor: 'pointer' }}
              onClick={() => history.push(user.isAuth ? '/profile' : '/login')}
            >
              <img
                src={user.user.avatar ? user.user.avatar : avatarDefault}
                className="drawer__avatar"
                alt="avatar"
              />
              <div
                style={{
                  fontSize: '12px',
                  marginLeft: '10px',
                }}
              >
                <div>{user.user.name}</div>
                <div>{user.user.email}</div>
              </div>
            </div>
          }
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default withRouter(NavBar);
