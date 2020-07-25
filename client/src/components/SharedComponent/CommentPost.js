import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Modal, Card, Avatar, Comment, Tooltip, Divider } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import Slider from "react-slick";
import "./Comment.css";
import {
    LeftOutlined,
    RightOutlined,
    HeartOutlined,
    HeartFilled,
    MessageOutlined,
    ShareAltOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/PostActions";
import CommentInput from "./CommentInput";
import Menu from "../screens/Home/Menu";
import { Scrollbars } from "react-custom-scrollbars";
// import _ from "lodash";
function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <div className="slide_arrow_next" onClick={onClick}>
            <RightOutlined />
        </div>
    );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <div className="slide_arrow_prev" onClick={onClick}>
            <LeftOutlined />
        </div>
    );
}
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 2,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
};

function CommentPost(props) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    return useMemo(() => {
        const { visible, item, onCancel, flag } = props;
        const like = async (id) => {
            await dispatch(likePost({ postId: id }, flag));
        };
        const unlike = async (id) => {
            await dispatch(unlikePost({ postId: id }, flag));
        };
        const destroyModal = () => {
            onCancel();
        };

        return (
            <Modal
                className="Modal"
                visible={visible}
                onCancel={onCancel}
                footer={null}
                destroyOnClose={true}
                style={{ top: 20 }}
            >
                {item._id && (
                    <Card
                        className="Home_Card"
                        title={
                            <div style={{ display: "flex" }}>
                                <Avatar
                                    src={
                                        /^upload/.test(item.postedBy.avatar)
                                            ? `/${item.postedBy.avatar}`
                                            : item.postedBy.avatar
                                    }
                                    size="large"
                                />
                                <div
                                    style={{
                                        lineHeight: "18px",
                                    }}
                                >
                                    <span
                                        style={{
                                            marginLeft: "10px",
                                        }}
                                    >
                                        <Link
                                            to={
                                                user._id === item.postedBy._id
                                                    ? "/profile"
                                                    : `/user/${item.postedBy._id}`
                                            }
                                        >
                                            {item.postedBy.name}
                                        </Link>
                                    </span>
                                    <br />
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "400",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        {moment(item.createdAt).format("LLL")}
                                    </span>
                                </div>
                            </div>
                        }
                        extra={
                            <Menu
                                post_id={item._id}
                                posted_by={item.postedBy._id}
                                user_id={user._id}
                                onClose={destroyModal}
                            />
                        }
                        style={{
                            maxWidth: "600px",
                        }}
                        actions={[
                            <CommentInput
                                key="comment"
                                postId={item._id}
                                flag={flag}
                            />,
                        ]}
                    >
                        <div>
                            {item.body && (
                                <div
                                    style={{
                                        padding: "10px",
                                        fontSize: "12px",
                                    }}
                                >
                                    {item.body}
                                </div>
                            )}
                            <Slider {...settings}>
                                {item.photos.map((image, index) => {
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                width: "100%",
                                            }}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`ảnh ${index}`}
                                                style={{
                                                    width: "100%",
                                                    maxHeight: "250px",
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </Slider>
                        </div>

                        <div
                            style={{
                                padding: "7px 5vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                {item.likes.indexOf(user._id) < 0 ? (
                                    <HeartOutlined
                                        style={{
                                            fontSize: "24px",
                                            marginRight: "7px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => like(item._id)}
                                    />
                                ) : (
                                    <HeartFilled
                                        style={{
                                            color: "#ff0000",
                                            fontSize: "24px",
                                            marginRight: "7px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => unlike(item._id)}
                                    />
                                )}
                                <span>{item.likes.length}</span>
                            </div>
                            <div>
                                <MessageOutlined
                                    style={{
                                        fontSize: "24px",
                                        marginRight: "7px",
                                        cursor: "pointer",
                                    }}
                                />
                                <span>{item.comments.length}</span>
                            </div>
                            <div>
                                <ShareAltOutlined
                                    style={{
                                        fontSize: "24px",
                                        cursor: "pointer",
                                    }}
                                />
                            </div>
                        </div>
                        <Divider style={{ margin: "0px" }} />
                        <Scrollbars
                            autoHeight
                            autoHeightMin={100}
                            autoHeightMax={250}
                            autoHide
                        >
                            <div className="Card__comment">
                                {item.comments.map((comment, index) => {
                                    let avatar = comment.postedBy.avatar;
                                    if (/^upload/.test(avatar)) {
                                        avatar = `/${avatar}`;
                                    }
                                    return (
                                        <Comment
                                            key={index}
                                            actions={null}
                                            author={
                                                <Link
                                                    to={
                                                        user._id ===
                                                        comment.postedBy._id
                                                            ? "/profile"
                                                            : `/user/${comment.postedBy._id}`
                                                    }
                                                >
                                                    {comment.postedBy.name}
                                                </Link>
                                            }
                                            avatar={
                                                <Avatar
                                                    src={
                                                        // comment.postedBy.avatar
                                                        avatar
                                                    }
                                                    alt="avatar"
                                                />
                                            }
                                            content={<p>{comment.text}</p>}
                                            datetime={
                                                <Tooltip
                                                    title={moment(
                                                        comment.date
                                                    ).format(
                                                        "YYYY-MM-DD HH:mm:ss"
                                                    )}
                                                >
                                                    <span>
                                                        {moment(
                                                            comment.date
                                                        ).fromNow()}
                                                    </span>
                                                </Tooltip>
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </Scrollbars>
                    </Card>
                )}
            </Modal>
        );
    }, [props, dispatch, user._id]);
}
export default CommentPost;
CommentPost.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    item: PropTypes.object,
    flag: PropTypes.string.isRequired,
};

CommentPost.defaultProps = {
    item: {},
};
