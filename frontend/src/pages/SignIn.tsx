import { ToastContainer } from "react-toastify";
import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";

const SignIn = () => {
  return (
    <div>
        <ToastContainer />
    <div className="grid grid-col-1 lg:grid-cols-2">
      <div>
        <Auth type={"signin"} />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>s
    </div>
  );
};

export default SignIn;
