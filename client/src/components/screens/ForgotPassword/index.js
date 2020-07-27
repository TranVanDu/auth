import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Form, Button, Input } from "antd";
import { toast } from "react-toastify";

export default function Forgot() {
    const history = useHistory();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    let arr = history.location.pathname.split("/");
    let token = arr[2];
    const onFinish = (values) => {
        setIsLoading(true);
        values = { ...values, token: token };
        fetch("/api/confirm-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.status_code === 200) {
                    toast.success("change password success");
                    setIsLoading(false);
                    history.push("/login");
                } else {
                    toast.error(result.message.name);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                setIsLoading(false);
                toast.error(err);
            });
    };
    return (
        <div style={{ maxWidth: "800px", margin: "10px auto" }}>
            <Card title="Reset password confirm">
                <Form form={form} onFinish={onFinish}>
                    <Form.Item
                        name="password"
                        label=" Mật khẩu mới"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "password is required",
                            },
                            {
                                min: 6,
                                message: "password has min 6 character ",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                    >
                        Submit
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
