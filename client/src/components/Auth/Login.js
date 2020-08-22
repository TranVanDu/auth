import React, { useState, useEffect, useRef } from "react";
// import ClassNames from "classnames";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { Button, Modal, Input, Form } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
    loginFacebook,
    loginGoogle,
    loginUser,
} from "../../actions/AuthActions";
import "./index.css";

export default function Login(props) {
    const history = useHistory();
    // const user = useSelector((state) => state.user);
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const mounted = useRef(false);
    // let isMounted = true;

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    const responseFacebook = async (response) => {
        if (response.userID) {
            const data = {
                userID: response.userID,
                accessToken: response.accessToken,
            };
            let result = await dispatch(loginFacebook(data));
            if (result.data.isAuth) {
                history.push("/");
            }
        }
    };

    const responseGoogle = async (response) => {
        if (response.tokenId) {
            const data = {
                tokenId: response.tokenId,
            };
            let result = await dispatch(loginGoogle(data));
            if (result.data.isAuth) {
                history.push("/");
            }
        }
    };

    const onOK = () => {
        setLoading(true);
        form.validateFields().then((values) => {
            fetch(`/api/forgot-password`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.status_code === 200) {
                        setText(result.message);
                        setLoading(false);
                        setTimeout(() => {
                            setShow(false);
                            form.resetFields();
                        }, 3000);
                    } else {
                        setLoading(false);
                        toast.error(result.status);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    toast.error(err);
                });
        });
    };

    return (
        <div className="container ">
            <div className="form-container sign-in-container">
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    onSubmit={async (values, { resetForm }) => {
                        setIsLoading(true);
                        try {
                            let result = await dispatch(loginUser(values));
                            if (mounted) {
                                if (result) {
                                    setTimeout(() => {
                                        history.push("/");
                                    }, 800);
                                    setIsLoading(false);
                                    resetForm({});
                                }
                            }
                        } catch (error) {
                            setFormErrorMessage(
                                "Check out your Account or Password again"
                            );
                            setIsLoading(false);
                        }
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email("Email is invalid")
                            .required("Email is required"),
                        password: Yup.string()
                            .required("Password is required")
                            .min(6, "Password must have min 6 character"),
                    })}
                >
                    {(props) => {
                        const {
                            values,
                            touched,
                            errors,
                            // dirty,
                            // isSubmitting,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            //handleReset,
                        } = props;
                        return (
                            <form onSubmit={handleSubmit}>
                                <h1>Login</h1>
                                <div className="social-container">
                                    <FacebookLogin
                                        appId={
                                            process.env
                                                .REACT_APP_FACEBOOK_APP_ID
                                        }
                                        autoLoad={false}
                                        fields="name,email,picture"
                                        scope="public_profile,user_friends"
                                        callback={responseFacebook}
                                        cssClass="social"
                                        textButton={
                                            <i className="fab fa-facebook-f"></i>
                                        }
                                    />
                                    <GoogleLogin
                                        clientId={
                                            process.env
                                                .REACT_APP_GOOGLE_CLIENT_ID
                                        }
                                        render={(renderProps) => (
                                            <button
                                                className="social"
                                                onClick={renderProps.onClick}
                                                disabled={renderProps.disabled}
                                            >
                                                <i
                                                    className="fab fa-google-plus-g"
                                                    title="google"
                                                ></i>
                                            </button>
                                        )}
                                        buttonText="Login"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                        cookiePolicy={"single_host_origin"}
                                    />
                                </div>
                                <span className="divider">
                                    or use your email for registration
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.email && touched.email
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.email && touched.email && (
                                    <div className="input-feedback">
                                        {errors.email}
                                    </div>
                                )}
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.password && touched.password
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.password && touched.password && (
                                    <div className="input-feedback">
                                        {errors.password}
                                    </div>
                                )}
                                {formErrorMessage && (
                                    <label style={{ width: "100%" }}>
                                        <p
                                            style={{
                                                color: "#ff0000bf",
                                                fontSize: "0.7rem",
                                                border: "1px solid",
                                                padding: "1rem",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {formErrorMessage}
                                        </p>
                                    </label>
                                )}
                                <div
                                    style={{
                                        width: "100%",
                                        textAlign: "end",
                                        margin: "10px",
                                    }}
                                >
                                    <Button
                                        type="link"
                                        style={{
                                            fontSize: "12px",
                                            borderRadius: "0px",
                                            border: "none",
                                            backgroundColor: "#fff",
                                            fontWeight: "400",
                                            color: "#c3226e",
                                            padding: "0px",
                                            letterSpacing: "0px",
                                            textTransform: "lowercase",
                                        }}
                                        onClick={() => {
                                            setShow(true);
                                        }}
                                    >
                                        forget a password?
                                    </Button>
                                    <Modal
                                        visible={show}
                                        title="Forget a password"
                                        onCancel={() => setShow(false)}
                                        footer={[
                                            <Button
                                                key="back"
                                                onClick={() => setShow(false)}
                                            >
                                                Cancel
                                            </Button>,
                                            <Button
                                                key="submit"
                                                loading={loading}
                                                type="primary"
                                                onClick={onOK}
                                            >
                                                Submit
                                            </Button>,
                                        ]}
                                    >
                                        {text === "" && (
                                            <Form form={form}>
                                                <Form.Item
                                                    name="email"
                                                    label="Email"
                                                    hasFeedback
                                                    rules={[
                                                        {
                                                            type: "email",
                                                            message:
                                                                "Email không hợp lệ",
                                                        },
                                                        {
                                                            required: true,
                                                            message:
                                                                "Email is require",
                                                        },
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Form>
                                        )}
                                        {text !== "" && (
                                            <div>
                                                <label
                                                    style={{ width: "100%" }}
                                                >
                                                    <p
                                                        style={{
                                                            color:
                                                                "rgba(49, 108, 184, 0.75)",
                                                            fontSize: "0.7rem",
                                                            border: "1px solid",
                                                            padding: "1rem",
                                                            borderRadius:
                                                                "10px",
                                                        }}
                                                    >
                                                        {text}
                                                    </p>
                                                </label>
                                            </div>
                                        )}
                                    </Modal>
                                </div>
                                <button type="submit">
                                    {isLoading && (
                                        <i className="fa fa-spinner fa-spin" />
                                    )}
                                    Sign Up
                                </button>
                                <Link to="/register">Don't have account?</Link>
                            </form>
                        );
                    }}
                </Formik>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-right">
                        <h1>Welcome Back!</h1>
                        <p>
                            To keep connected with us please login with your
                            personal info
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
