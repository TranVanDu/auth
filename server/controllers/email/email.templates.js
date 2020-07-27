// const CLIENT_ORIGIN = "http://localhost:3000";
const CLIENT_ORIGIN = "https://auth-chat.herokuapp.com";
module.exports = {
    confirm: (id) => ({
        subject: "React Confirm Email",
        html: `
      <a href='${CLIENT_ORIGIN}/confirm/${id}'>
        click to confirm email
      </a>
    `,
        text: `Copy and paste this link: ${CLIENT_ORIGIN}/confirm/${id}`,
    }),
    resetPassword: (token) => ({
        subject: "React forgot password Email",
        html: `
		<div>
			<h2>Hi, some one request that the password for account be reset</h2>
			<a href='${CLIENT_ORIGIN}/confirm-password/${token}'>
				click to change password
			</a>
		</div>
    `,
        text: `Copy and paste this link: $${CLIENT_ORIGIN}/confirm-password/${token}`,
    }),
};
