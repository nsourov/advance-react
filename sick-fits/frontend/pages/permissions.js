import PleaseSignIn from "../components/PleaseSignIn";
import Permissions from "../components/Permissions";

const Permission = props => (
  <div>
    <PleaseSignIn>
      <Permissions />
    </PleaseSignIn>
  </div>
);

export default Permission;
