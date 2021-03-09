import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import GraphQLClient from '../../utils/GraphQLClient';

const UPDATESETTINGS = gql`mutation updateSettings($settings: SettingsInput!){
  updateSettings(settings: $settings) {
    searchEngine,
    googleToken,
    backgroundImage
  }
}`

function Settings({ settings, setSettings, setLoggedIn }) {
  const [tempSettings, setTempSettings] = useState({ searchEngine: settings.searchEngine, googleToken: settings.googleToken, backgroundImage: settings.backgroundImage });
  const [updateSettings, { called, error, loading, data }] = useMutation(UPDATESETTINGS, {
    variables: { settings: tempSettings }
  });

  const logOut = () => {
    localStorage.clear();
    GraphQLClient.resetStore();
    setLoggedIn(false);
  }

  if (!loading && data && called) {
    localStorage.setItem("settings", JSON.stringify(data.updateSettings))
    setSettings(data.updateSettings)
  }

  return (
    <div className="settings">
      <label htmlFor="searchengine">Search engine:</label>
      <select name="searchengine" id="searchengine" value={tempSettings.searchEngine} onChange={(ev) => setTempSettings({ ...tempSettings, searchEngine: ev.target.value })}>
        <option value="GOOGLE">Google</option>
        <option value="DUCKDUCKGO">Duck duck go</option>
        <option value="YAHOO">Yahoo</option>
        <option value="BING">Bing</option>
      </select>
      <label htmlFor="searchengine">Background image:</label>
      <input type="text" name="bgImage" id="bgImage" value={tempSettings.backgroundImage} onChange={(ev) => setTempSettings({ ...tempSettings, backgroundImage: ev.target.value })} />
      <label htmlFor="searchengine">Google token:</label>
      <input type="text" name="googleToken" id="googleToken" value={tempSettings.googleToken} onChange={(ev) => setTempSettings({ ...tempSettings, googleToken: ev.target.value })} />
      <button onClick={updateSettings}>Save</button>
      <a onClick={logOut} href="#">LOGOUT</a>
    </div>
  );
}

export default Settings;
