import { FC } from "react";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Banner from "../../services/Banner";
import { useAuth } from "../../hooks/useAuth";

const Logout: FC = () => {
  const { logout } = useAuth();
  const { makeApiCall } = useApi();
  const navigate = useNavigate();
  const onClickLogout = async () => {
    try {
      makeApiCall("/auth/logout", { method: "POST" });
      logout();
      navigate("/");
    } catch (error) {
      return <Banner type={"ERROR"} message={`Error while logins out`} />;
    }
  };
  return (
    <button
      onClick={onClickLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

export default Logout;
