import Home from "../components/screens/Home/Home";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Resgister";
import CreatePost from "../components/screens/CreatePost/CreatePost";
import NotFound from "../components/screens/NotFound/NotFound";
import MyFollowingPost from "../components/screens/MyFollowingPost/MyFollowingPost";
import Profile from "../components/screens/Profile/Profile";
import UserProfile from "../components/screens/UserProfile/UserProfile";
import Forgot from "../components/screens/ForgotPassword/index";
import ChatPage from "../components/screens/Chat/ChatPage";
export const Routes = [
    {
        path: "/",
        exact: true,
        component: Home,
    },
    {
        path: "/login",
        exact: true,
        component: Login,
    },
    {
        path: "/register",
        exact: true,
        component: Register,
    },
    {
        path: "/create-post",
        exact: true,
        component: CreatePost,
    },

    {
        path: "/my-following",
        exact: true,
        component: MyFollowingPost,
    },
    {
        path: "/profile",
        exact: true,
        component: Profile,
    },
    {
        path: "/chat",
        exact: true,
        component: ChatPage,
    },
    {
        path: "/confirm-password/:token",
        exact: true,
        component: Forgot,
    },
    {
        path: "/user/:userId",
        exact: true,
        component: UserProfile,
    },
    {
        path: "*",
        exact: true,
        component: NotFound,
    },
];
