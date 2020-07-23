import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Divider, Empty } from "antd";
import { getMyPosts, getPost } from "../../../actions/PostActions";
import { CameraOutlined } from "@ant-design/icons";
import Carousel, { Modal, ModalGateway } from "react-images";
import CommentPost from "../../SharedComponent/CommentPost";
import Gallery from "./Gallery";
import UploadAvatar from "./UploadAvatar";
import _ from "lodash";
import "./Profile.css";

export default function Profile() {
    const currentPost = useSelector((state) => state.post.currentPost);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const myPosts = useSelector((state) => state.post.myPosts);
    const [visible, setVibisle] = useState(false);
    const [onChange, setOnChange] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        let isMounted = true;
        const fecthPost = async () => {
            try {
                await dispatch(getMyPosts());
                if (isMounted) {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                }
            } catch (err) {
                setIsLoading(false);
            }
        };
        fecthPost();
        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
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
    const handleCancel = () => {
        setOnChange(false);
    };

    return (
        <div>
            {!isLoading ? (
                <div className="profile">
                    {!_.isEmpty(user) ? (
                        <div className="profile__header">
                            <div style={{ position: "relative" }}>
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    onClick={() => setModalIsOpen(true)}
                                />

                                <CameraOutlined
                                    className="profile__header--camera"
                                    onClick={() => setOnChange(true)}
                                />
                            </div>
                            <div className="profile__header--user">
                                <div>{user.name}</div>
                                <div>{user.email}</div>
                                <div className="header--description">
                                    <div>
                                        {myPosts.posts.length > 0
                                            ? myPosts.posts.length
                                            : 0}
                                        <span> posts</span>
                                    </div>
                                    <div>
                                        {user.followers.length > 0
                                            ? user.followers.length
                                            : 0}
                                        <span> followers</span>
                                    </div>
                                    <div>
                                        {user.following.length > 0
                                            ? user.following.length
                                            : 0}
                                        <span> following</span>
                                    </div>
                                </div>
                            </div>
                            <UploadAvatar
                                visible={onChange}
                                onCancel={handleCancel}
                                avatar={user.avatar}
                            />
                            <ModalGateway>
                                {modalIsOpen ? (
                                    <Modal onClose={toggleModal}>
                                        <Carousel
                                            views={[{ src: user.avatar }]}
                                        />
                                    </Modal>
                                ) : null}
                            </ModalGateway>
                        </div>
                    ) : null}
                    <Divider style={{ margin: "5px 0px" }} />
                    <div>
                        {myPosts.posts.length > 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                }}
                            >
                                {myPosts.posts.map((post, index) => {
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
