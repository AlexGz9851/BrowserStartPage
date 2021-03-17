import LogIn from "./Login";
import SignUp from "./Signup";

function FirstConnection({ setLoggedIn, setSettings }) {
  return (
    <div className="NewUser">
      <LogIn setLoggedIn={setLoggedIn} setSettings={setSettings} />
      <SignUp setLoggedIn={setLoggedIn} setSettings={setSettings} />
    </div>
  );
}

export default FirstConnection;
