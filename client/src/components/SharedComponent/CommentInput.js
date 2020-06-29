import React, { useState } from "react";
import PropTypes from "prop-types";
import { commentPost } from "../../actions/PostActions";
import { useDispatch } from "react-redux";
import "./Comment.css";

function CommentInput(props) {
    const [input, setInput] = useState("");
    const dispatch = useDispatch();

    const onSubmit = async (event) => {
        event.preventDefault();
        if (input.length > 0) {
            await dispatch(
                commentPost({ text: input, postId: props.postId }, props.flag)
            );
        }
        setInput("");
    };
    return (
        <form onSubmit={onSubmit} style={{ display: "flex" }}>
            <input
                className="form__input"
                name="text"
                placeholder="Thêm bình luận..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button
                type="submit"
                className="form__button"
                style={{
                    opacity: input.length > 0 ? "1" : "0.1",
                    cursor: input.length > 0 ? "pointer" : "default",
                }}
            >
                Đăng
            </button>
        </form>
    );
}

CommentInput.propTypes = {
    flag: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
};
export default CommentInput;
