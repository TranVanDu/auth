import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Divider, Modal, Input, Form, Radio, DatePicker, Button } from "antd";
import { EditTwoTone, LockTwoTone, SettingFilled } from "@ant-design/icons";
import moment from "moment";
import { updateProfile, changePassword } from "../../../actions/AuthActions";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
};

export default function Setting(props) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [profile, setProfile] = useState(false);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user.user);
    const { visible, onClose } = props;

    const onOK = () => {
        form.validateFields().then(async (values) => {
            setLoading(true);
            try {
                if (update) {
                    values.birthday = moment(values.birthday).format(
                        "YYYY-MM-DD"
                    );
                    await dispatch(updateProfile(values));
                    form.resetFields();
                    setLoading(false);
                    setProfile(false);
                } else {
                    await dispatch(changePassword(values));
                    form.resetFields();
                    setLoading(false);
                    setProfile(false);
                }
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        });
    };

    return (
        <div>
            <Modal
                title={
                    <div>
                        <SettingFilled /> Setting
                    </div>
                }
                visible={visible}
                onCancel={() => onClose()}
                footer={null}
            >
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        onClose();
                        setProfile(true);
                        setUpdate(true);
                    }}
                >
                    <EditTwoTone
                        twoToneColor="#c41717"
                        style={{
                            paddingRight: "7px",
                        }}
                    />
                    update profile
                </div>
                <Divider />
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        onClose();
                        setProfile(true);
                        setUpdate(false);
                    }}
                >
                    <LockTwoTone
                        twoToneColor="#c41717"
                        style={{
                            paddingRight: "7px",
                        }}
                    />
                    change password
                </div>
            </Modal>
            <Modal
                visible={profile}
                style={{ top: 15 }}
                title={
                    update ? (
                        <div>
                            <EditTwoTone
                                twoToneColor="#c41717"
                                style={{
                                    paddingRight: "7px",
                                }}
                            />
                            Update profile
                        </div>
                    ) : (
                        <div>
                            <LockTwoTone
                                twoToneColor="#c41717"
                                style={{
                                    paddingRight: "7px",
                                }}
                            />
                            Change Password
                        </div>
                    )
                }
                okText="Update"
                onCancel={() => setProfile(false)}
                onOk={onOK}
                footer={[
                    <Button key="back" onClick={() => setProfile(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={onOK}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <Form
                    {...layout}
                    form={form}
                    initialValues={{
                        name: user.name,
                        phone: user.phone,
                        sex: user.sex,
                        birthday: moment(user.birthday),
                    }}
                >
                    {!update ? (
                        <div>
                            <Form.Item
                                name="old_password"
                                label="Mật khẩu cũ"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Password is require!",
                                    },
                                    {
                                        min: 6,
                                        message: "Password has min 6 character",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="new_password"
                                label="Mật khẩu mới"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Password is require!",
                                    },
                                    {
                                        min: 6,
                                        message: "Password has min 6 character",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="confirm_password"
                                label="Xác nhận mật khẩu"
                                hasFeedback
                                dependencies={["new_password"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Password is require!",
                                    },
                                    {
                                        min: 6,
                                        message: "Password has min 6 character",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (
                                                !value ||
                                                getFieldValue(
                                                    "new_password"
                                                ) === value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                "The two passwords that you entered do not match!"
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </div>
                    ) : (
                        <div>
                            <Form.Item
                                name="name"
                                label="Tên"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="birthday"
                                label="Ngày sinh"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format={"DD/MM/YYYY"}
                                />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="sex"
                                label="Giới tính"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Radio.Group>
                                    <Radio value="male">Nam</Radio>
                                    <Radio value="Female">Nữ</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    )}
                </Form>
            </Modal>
        </div>
    );
}
