import React, { useState } from "react";
import { Modal, Button } from "antd";
import UploadFile from "../../Upload/UploadFile";
import { useDispatch } from "react-redux";
import { updateAvatar } from "../../../actions/AuthActions";
import { getCookie } from "../../../helpers/session";
import "./Profile.css";

export default function UploadAvatar(props) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [select, setSelect] = useState(false);
    const [file, setFile] = useState("");
    const handleOk = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file[0].originFileObj);
            const config = {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: "Bearer " + getCookie("insta_token"),
                },
            };
            let data = await dispatch(updateAvatar(formData, config));

            if (data) {
                setTimeout(async () => {
                    await setLoading(false);
                    setSelect(true);
                    props.onCancel();
                }, 800);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const onChange = (file) => {
        setFile(file);
    };
    return (
        <Modal
            visible={props.visible}
            title="Change avatar"
            onOk={handleOk}
            onCancel={() => props.onCancel()}
            footer={[
                <Button key="back" onClick={() => props.onCancel()}>
                    Trở lại
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleOk}
                >
                    Đồng ý
                </Button>,
            ]}
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <p>Avatar hiện tại</p>
                    <img
                        src={props.avatar}
                        alt="avatar hiện tại"
                        style={{
                            width: "104px",
                            height: "104px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                </div>
                <div
                    style={{ display: "flex", alignItems: "center" }}
                >{`=>`}</div>
                <div className="modal__avatar">
                    <p>Avatar thay đổi </p>
                    <UploadFile
                        number={1}
                        onChangeData={onChange}
                        select={select}
                    />
                </div>
            </div>
        </Modal>
    );
}
