import React from "react";
import { SmileTwoTone } from "@ant-design/icons";

function Footer() {
    return (
        <div
            style={{
                height: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                background: "#eee",
            }}
        >
            <p>
                Happy Coding <SmileTwoTone twoToneColor="#eb2f96" />
            </p>
        </div>
    );
}

export default Footer;
