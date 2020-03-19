import React from 'react';
import ListPost from './post/ListPost';
//import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav className="App-nav">
          <button id="homeButton">Home</button>
          <button id="loginButton">Login</button>
        </nav>
      </header>
      <main>
        <aside>
          <form className="Filter">
          </form>
        </aside>
        <div className="Body">
          <ListPost />
        </div>
      </main>
      <footer className="App-footer"></footer>
    </div>
  );
}

export default App;
