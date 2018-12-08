import React, { Component } from 'react';
import './App.css';
import './Components/Communities/List';
import List from "./Components/Communities/List";

class App extends Component {
  render() {
    return (
      <div className="App">
        <List/>
      </div>
    );
  }
}

export default App;
