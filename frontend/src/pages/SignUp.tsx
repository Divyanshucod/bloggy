import { ToastContainer } from "react-toastify";
import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";

const SignUp = () => {
  return (
    <div>
      <ToastContainer />
      <div className="grid grid-col-1 lg:grid-cols-2">
        <div>
          <Auth type={"signup"} />
        </div>
        <div className="hidden lg:block">
          <Quote />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
