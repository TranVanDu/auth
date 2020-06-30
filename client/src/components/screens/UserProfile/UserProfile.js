import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Divider, Empty, Tag } from "antd";
import { useParams } from "react-router-dom";
import { getPost } from "../../../actions/PostActions";
import { getCurrentUser, follow, unfollow } from "../../../actions/UserActions";
import Carousel, { Modal, ModalGateway } from "react-images";
import CommentPost from "../../SharedComponent/CommentPost";
import Gallery from "../Profile/Gallery";
//import _ from "lodash";
import "../Profile/Profile.css";

export default function Profile() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile);
    const currentPost = useSelector((state) => state.post.currentPost);
    const user = useSelector((state) => state.user.user);
    const { userId } = useParams();
    const [visible, setVibisle] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showFollow, setShowFollow] = useState(
        user.following ? !user.following.includes(userId) : true
    );

    useEffect(() => {
        setIsLoading(true);
        let isMounted = true;
        const fecthPost = async () => {
            try {
                await dispatch(getCurrentUser(userId));
                if (isMounted) {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                }
            } catch (err) {
                setIsLoading(false);

                window.location.reload();
            }
        };
        fecthPost();
        return () => {
            isMounted = false;
        };
    }, [dispatch, userId]);

    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };
    const onToggleModal = async (id) => {
        await dispatch(getPost(id));
        setVibisle(true);
    };
    const onCancel = () => {
        setVibisle(false);
    };
    const onFollow = async (id) => {
        await dispatch(follow({ followId: id }));
        setShowFollow(false);
    };
    const onUnFollow = async (id) => {
        await dispatch(unfollow({ followId: id }));
        setShowFollow(true);
    };

    return (
        <div>
            {!isLoading ? (
                <div className="profile">
                    {profile.user ? (
                        <div className="profile__header">
                            <div style={{ position: "relative" }}>
                                <img
                                    src={
                                        /^upload/.test(profile.user.avatar)
                                            ? `/${profile.user.avatar}`
                                            : profile.user.avatar
                                    }
                                    alt="avatar"
                                    onClick={() => setModalIsOpen(true)}
                                />
                            </div>
                            <div className="profile__header--user">
                                <div style={{ display: "flex" }}>
                                    <div>{profile.user.name}</div>
                                    <div style={{ paddingLeft: "10px" }}>
                                        {showFollow ? (
                                            <Tag
                                                color="geekblue"
                                                onClick={() =>
                                                    onFollow(profile.user._id)
                                                }
                                            >
                                                Follow
                                            </Tag>
                                        ) : (
                                            <Tag
                                                color="volcano"
                                                onClick={() =>
                                                    onUnFollow(profile.user._id)
                                                }
                                            >
                                                unFollow
                                            </Tag>
                                        )}
                                    </div>
                                </div>
                                <div>{profile.user.email}</div>
                                <div className="header--description">
                                    <div>
                                        {profile.posts.length > 0
                                            ? profile.posts.length
                                            : 0}
                                        <span> posts</span>
                                    </div>
                                    <div>
                                        {profile.user.followers
                                            ? profile.user.followers.length
                                            : 0}
                                        <span> followers</span>
                                    </div>
                                    <div>
                                        {profile.user.following
                                            ? profile.user.following.length
                                            : 0}
                                        <span> following</span>
                                    </div>
                                </div>
                            </div>
                            <ModalGateway>
                                {modalIsOpen ? (
                                    <Modal onClose={toggleModal}>
                                        <Carousel
                                            views={[
                                                {
                                                    src: /^upload/.test(
                                                        profile.user.avatar
                                                    )
                                                        ? `/${profile.user.avatar}`
                                                        : profile.user.avatar,
                                                },
                                            ]}
                                        />
                                    </Modal>
                                ) : null}
                            </ModalGateway>
                        </div>
                    ) : null}
                    <Divider style={{ margin: "5px 0px" }} />
                    <div>
                        {profile.posts.length > 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                }}
                            >
                                {profile.posts.map((post, index) => {
                                    return (
                                        <Gallery
                                            key={index}
                                            post={post}
                                            onClick={onToggleModal}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <Empty />
                        )}
                    </div>
                    <CommentPost
                        visible={visible}
                        onCancel={onCancel}
                        item={currentPost}
                        flag="my"
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
                    <Spin size="large" />
                </div>
            )}
        </div>
    );
}
