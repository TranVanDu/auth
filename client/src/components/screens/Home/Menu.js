import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../../actions/PostActions";
import { Button, Popover, Divider } from "antd";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

// eslint-disable-next-line
const Menu = (props) => {
    const [visiable, setVisiable] = useState(false);
    const dispatch = useDispatch();
    const { post_id, user_id, posted_by } = props;
    const [isLoading, setIsLoading] = useState(false);
    const removePost = async () => {
        try {
            setIsLoading(true);
            await dispatch(deletePost(post_id));
            setTimeout(() => {
                setIsLoading(false);
                setVisiable(false);
            }, 800);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };
    return (
        <Popover
            placement="leftTop"
            content={
                <div>
                    {posted_by === user_id ? (
                        <Button
                            type="link"
                            style={{ color: "#000" }}
                            onClick={removePost}
                            loading={isLoading}
                        >
                            <DeleteOutlined
                                style={{ color: "#ff0000", margin: "0px 5px" }}
                            />
                            Xóa bài viết
                        </Button>
                    ) : (
                        <Button
                            type="link"
                            style={{
                                color: "#000",
                                opacity: "0.2",
                                cursor: "default",
                            }}
                        >
                            <DeleteOutlined
                                style={{ color: "#ff0000", margin: "0px 5px" }}
                            />
                            Xóa bài viết
                        </Button>
                    )}
                    <Divider style={{ margin: "3px" }} />
                </div>
            }
            trigger="click"
            visible={visiable}
            onVisibleChange={(visible) => setVisiable(visible)}
        >
            <EllipsisOutlined style={{ fontSize: "24px" }} />
        </Popover>
    );
};

export default Menu;

Menu.propTypes = {
    post_id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
    posted_by: PropTypes.string.isRequired,
};
