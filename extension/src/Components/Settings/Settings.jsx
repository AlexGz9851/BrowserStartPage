import { useMutation, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import GraphQLClient from '../../utils/GraphQLClient';

const UPDATESETTINGS = gql`mutation updateSettings($settings: SettingsInput!){
  updateSettings(settings: $settings) {
    searchEngine,
    googleToken,
    backgroundImage
  }
}`

function Settings({ settings, setSettings, setLoggedIn, imgUrl }) {
  const [updateSettings, { called, loading, data }] = useMutation(UPDATESETTINGS, {
    variables: { settings }
  });
  const [backUp, setBackUp] = useState({ ...settings })
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!loading && data && called) {
      localStorage.setItem("settings", JSON.stringify(data.updateSettings))
      setSettings(data.updateSettings)
      setBackUp(data.updateSettings)
    }
  }, [data, loading, called, backUp])

  const logOut = () => {
    setLoggedIn(false);
    setSettings({});
    localStorage.clear();
    GraphQLClient.clearStore();
  }

  const removeChanges = () => {
    setSettings({ ...backUp })
  }

  return (
    <div className="settings">
      <label htmlFor="searchengine">Search engine:</label>
      <select name="searchengine" id="searchengine" value={settings.searchEngine} onChange={(ev) => setSettings({ ...settings, searchEngine: ev.target.value })}>
        <option value="GOOGLE">Google</option>
        <option value="DUCKDUCKGO">Duck duck go</option>
        <option value="YAHOO">Yahoo</option>
        <option value="BING">Bing</option>
      </select>
      <label htmlFor="bgImage">Background image:</label>
      <input id="bgImage" name="bgImage" type="file" onChange={ev => {
        const formData = new FormData();
        formData.append("image", ev.target.files[0]);
        fetch(imgUrl, { method: "POST", body: formData, headers: { "Authorization": "Bearer " + token } })
          .then(res => res.json())
          .then(data => {
            setSettings({ ...settings, backgroundImage: data.id })
          })
      }} />
      {/* <input type="text" name="bgImage" id="bgImage" value={tempSettings.backgroundImage} onChange={(ev) => setTempSettings({ ...tempSettings, backgroundImage: ev.target.value })} /> */}
      <label htmlFor="searchengine">Google token:</label>
      <input type="text" name="googleToken" id="googleToken" value={settings.googleToken} onChange={(ev) => setSettings({ ...settings, googleToken: ev.target.value })} />
      <button onClick={updateSettings}>Save</button>
      <button onClick={removeChanges}>Cancel</button>
      <span onClick={logOut} style={{ cursor: 'pointer', color: "blue" }}>LOGOUT</span>
    </div>
  );
}

export default Settings;
