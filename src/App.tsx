import React, { useState } from "react";
import Header from "./components/Header.tsx";
import UserItems from "./components/UserItems.tsx";
import "./App.css";

interface UserInfo {
  username: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);

  return (
    <div>
      <Header
        onUserSignIn={(userInfo: UserInfo) => setUser(userInfo)}
        onUserSignOut={() => setUser(null)}
      />
      <main className="mainStyle">
        {user ? (
          <UserItems user={user} />
        ) : (
          <p>Please sign in to view your items.</p>
        )}
      </main>
    </div>
  );
};

export default App;
