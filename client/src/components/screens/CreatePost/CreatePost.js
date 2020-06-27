import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Avatar, Form, Input, Button } from "antd";
import { useHistory } from "react-router-dom";
import UploadFile from "../../Upload/UploadFile";
import { getCookie } from "../../../helpers/session";
import { createPost } from "../../../actions/PostActions";
const { TextArea } = Input;

export default function CreatePost() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state.user.user);
    const [file, setFile] = useState([]);
    const [select, setSelect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("body", values.body);
            for (let i = 0; i < file.length; i++) {
                formData.append("image", file[i].originFileObj);
            }
            const config = {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: "Bearer " + getCookie("insta_token"),
                },
            };

            let data = await dispatch(createPost(formData, config));

            if (data) {
                await setIsLoading(false);
                form.resetFields();
                setSelect(true);
                setTimeout(() => {
                    history.push("/");
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const onChange = (file) => {
        setFile(file);
    };

    return (
        <Card
            style={{
                maxWidth: "800px",
                margin: "10px auto",
            }}
            title={
                <div>
                    <Avatar src={user.avatar} size="large" />
                    <span style={{ marginLeft: "10px" }}>{user.name}</span>
                </div>
            }
            extra="Tạo bài viết"
        >
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item name="body">
                    <TextArea rows={6} placeholder="Bạn đang nghĩ gì ?" />
                </Form.Item>
                <Form.Item>
                    <UploadFile onChangeData={onChange} select={select} />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Tạo bài viết
                </Button>
            </Form>
        </Card>
    );
}
