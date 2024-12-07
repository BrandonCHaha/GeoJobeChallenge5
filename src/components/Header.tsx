import React from "react";
import ArcGISAuth from "./LogIn";

interface HeaderProps {
  onUserSignIn: (userInfo: { username: string }) => void;
  onUserSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUserSignIn, onUserSignOut }) => {
  return (
    <header className="headerStyle">
      <h1 className="titleStyle">ArcGIS Item Viewer</h1>
      <ArcGISAuth onUserSignIn={onUserSignIn} onUserSignOut={onUserSignOut} />
    </header>
  );
};

export default Header;
