import './App.css';
import React, { Component } from 'react';
import 'tachyons';
import Survey from './Components/Survey';

const intialState = {
  route: 'app'
}

class App extends Component {
  constructor() {
    super();
    this.state = intialState;
  }

  onRouteChange = (route) => {
    this.setState({
      route: route
    })
  }

  componentDidMount() {
    fetch('http://localhost:3001/reload', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    }).then(data => console.log(data))
  }

  render() {
    return (
      <div>
        {this.state.route === 'app' ?
          <div className="App">
            <header className="App-header">
              <h2>Let's Start the Survey</h2>
              <button className='pa2 ma2 pl4 pr4 bg-red white br4 pointer bw2 b--white' onClick={() => this.onRouteChange('survey')}> GO </button>
            </header> </div>
          : <Survey onRouteChange={this.onRouteChange}> </Survey>
        }

      </div>
    )
  } 
}


export default App;
