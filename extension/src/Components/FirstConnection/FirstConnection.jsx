import LogIn from "./Login";
import SignUp from "./Signup";

function FirstConnection({ setLoggedIn }) {
  return (
    <div className="NewUser">
      <LogIn setLoggedIn={setLoggedIn} />
      <SignUp setLoggedIn={setLoggedIn} />
    </div>
  );
}

export default FirstConnection;
