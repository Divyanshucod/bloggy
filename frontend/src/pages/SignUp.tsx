import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";

const SignUp = () => {
  return (
    <div>
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
