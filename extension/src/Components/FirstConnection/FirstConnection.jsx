import React, { useState } from "react";
import { Tabs, Tab, Card } from "@material-ui/core";
import LogIn from "./Login";
import SignUp from "./Signup";

function FirstConnection({ setLoggedIn, setSettings }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <Card>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            style={{ marginBottom:20 }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
        {value === 0 ?
            <LogIn setLoggedIn={setLoggedIn} setSettings={setSettings}/>
            :
            <SignUp setLoggedIn={setLoggedIn} setSettings={setSettings}/>
          }
      </Card>
  );
}

export default FirstConnection;
