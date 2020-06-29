import React, { Component } from "react";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Upload.css";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

class UploadFile extends Component {
    state = {
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: [],
    };
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.select !== this.props.select) {
            this.setState({
                fileList: [],
            });
        }
    }

    static defaultProps = {
        onChangeData: () => {},
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle:
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
        });
    };

    handleChange = ({ fileList }) => {
        this.setState({ fileList });
        this.props.onChangeData(fileList);
    };

    render() {
        const {
            previewVisible,
            previewImage,
            fileList,
            previewTitle,
        } = this.state;
        const number = this.props.number || 5;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    beforeUpload={() => {
                        return false;
                    }}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= number ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={previewImage}
                    />
                </Modal>
            </div>
        );
    }
}

export default UploadFile;
