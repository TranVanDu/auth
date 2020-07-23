import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    getSubPost,
    likePost,
    unlikePost,
    getPost,
} from "../../../actions/PostActions";
import { Skeleton, Card, Result, Button, Avatar, Spin } from "antd";
import {
    LeftOutlined,
    RightOutlined,
    HeartOutlined,
    HeartFilled,
    MessageOutlined,
    ShareAltOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Menu from "../Home/Menu";
import Slider from "react-slick";
import CommentInput from "../../SharedComponent/CommentInput";
import CommentPost from "../../SharedComponent/CommentPost";
import "../Home/Home.css";

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

const MyFollowingPost = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const subPosts = useSelector((state) => state.post.subPosts);
    const user = useSelector((state) => state.user.user);
    const [isLoading, setIsLoading] = useState(false);
    const currentPost = useSelector((state) => state.post.currentPost);
    const [visible, setVibisle] = useState(false);

    useEffect(() => {
        let didCancel = false;
        setIsLoading(true);
        const fecthData = async () => {
            try {
                await dispatch(getSubPost());
                if (!didCancel) {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                }
            } catch (err) {
                setIsLoading(false);
            }
        };
        fecthData();
        return () => {
            didCancel = true;
            setIsLoading(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const like = async (id) => {
        try {
            await dispatch(likePost({ postId: id }, "sub"));
        } catch (err) {}
    };
    const unlike = async (id) => {
        try {
            await dispatch(unlikePost({ postId: id }, "sub"));
        } catch (err) {}
    };

    const onToggleModal = async (id) => {
        try {
            await dispatch(getPost(id));
            setVibisle(true);
        } catch (err) {}
    };

    const onCancel = () => {
        setVibisle(false);
    };

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
    return (
        <div>
            {subPosts.posts.length > 0 ? (
                <div>
                    {subPosts.posts.map((item, index) => {
                        return (
                            <Card
                                className="Home_Card"
                                key={index}
                                title={
                                    <Skeleton
                                        loading={isLoading}
                                        avatar
                                        paragraph={{ rows: 0 }}
                                    >
                                        <div style={{ display: "flex" }}>
                                            <Avatar
                                                src={item.postedBy.avatar}
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
                                                    {item.postedBy.name}
                                                </span>
                                                <br />
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        fontWeight: "400",
                                                        marginLeft: "10px",
                                                    }}
                                                >
                                                    {moment(
                                                        item.createdAt
                                                    ).format("LLL")}
                                                </span>
                                            </div>
                                        </div>
                                    </Skeleton>
                                }
                                extra={
                                    <Menu
                                        post_id={item._id}
                                        posted_by={item.postedBy._id}
                                        user_id={user._id}
                                    />
                                }
                                style={{
                                    maxWidth: "600px",
                                }}
                                actions={[
                                    <Skeleton
                                        loading={isLoading}
                                        active
                                        paragraph={{ rows: 0 }}
                                    >
                                        <CommentInput
                                            key="comment"
                                            postId={item._id}
                                            flag="sub"
                                        />
                                    </Skeleton>,
                                ]}
                            >
                                {!isLoading ? (
                                    <div>
                                        {item.body && (
                                            <div
                                                style={{
                                                    padding: "20px 20px",
                                                    fontSize: "14px",
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
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </Slider>
                                    </div>
                                ) : (
                                    <Skeleton.Input
                                        style={{ width: "600px" }}
                                        active={true}
                                        size={300}
                                    />
                                )}
                                <Skeleton
                                    loading={isLoading}
                                    active
                                    paragraph={{ rows: 1 }}
                                >
                                    <div
                                        style={{
                                            padding: "18px 5vh",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div>
                                            {item.likes.indexOf(user._id) <
                                            0 ? (
                                                <HeartOutlined
                                                    style={{
                                                        fontSize: "24px",
                                                        marginRight: "7px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        like(item._id)
                                                    }
                                                />
                                            ) : (
                                                <HeartFilled
                                                    style={{
                                                        color: "#ff0000",
                                                        fontSize: "24px",
                                                        marginRight: "7px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        unlike(item._id)
                                                    }
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
                                                onClick={() =>
                                                    onToggleModal(item._id)
                                                }
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
                                </Skeleton>
                            </Card>
                        );
                    })}
                    <CommentPost
                        visible={visible}
                        onCancel={onCancel}
                        item={currentPost}
                        flag="sub"
                    />
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        minHeight: "calc(100vh - 60px)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {isLoading ? (
                        <Spin size="large" />
                    ) : (
                        <Result
                            status="404"
                            subTitle="Chưa có bài viết nào, mời bạn follow thêm nhiều người bạn nữa"
                            extra={
                                <Button
                                    type="primary"
                                    onClick={() => history.push("/")}
                                >
                                    Back Home
                                </Button>
                            }
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default MyFollowingPost;
