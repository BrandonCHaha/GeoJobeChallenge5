import React, { useEffect, useState } from "react";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";

interface ArcGISAuthProps {
  onUserSignIn: (userInfo: { username: string }) => void;
  onUserSignOut: () => void;
}

const ArcGISAuth: React.FC<ArcGISAuthProps> = ({
  onUserSignIn,
  onUserSignOut,
}) => {
  const [username, setUsername] = useState<string | null>(null);
  const portalUrl = "https://www.arcgis.com";
  const appId = "st6Mme0aV5j4PUs3";

  useEffect(() => {
    const info = new OAuthInfo({
      appId,
      popup: false,
    });

    IdentityManager.registerOAuthInfos([info]);

    IdentityManager.checkSignInStatus(`${info.portalUrl}/sharing`)
      .then(handleAutoSignIn)
      .catch(() => handleSignOut(false));
  }, []);

  const handleAutoSignIn = async () => {
    try {
      const portal = new Portal();
      await portal.load();
      const user = portal.user.username;
      setUsername(user || null);
      if (user) onUserSignIn({ username: user });
    } catch (error) {
      console.error("Error during auto sign-in:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      await IdentityManager.getCredential(`${portalUrl}/sharing`);
      await handleAutoSignIn();
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleSignOut = (reload = true) => {
    setUsername(null);
    IdentityManager.destroyCredentials();
    onUserSignOut();
    if (reload) {
      window.location.reload();
    }
  };

  return (
    <div>
      {username ? (
        <div className="d-flex align-items-center">
          <p className="mb-0 me-3">{username}</p>
          <button
            onClick={() => handleSignOut()}
            className="mainButtonStyle btn btn-primary"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="mainButtonStyle btn btn-primary"
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default ArcGISAuth;
