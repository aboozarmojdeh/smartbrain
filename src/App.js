import React, { Component } from 'react';
import Clarifai from 'clarifai';
// import Particles from 'react-particles-js';
import Particles from "react-tsparticles";
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Facerecognition from './components/Facerecognition/Facerecognition';
import './App.css';
import {particlesOptions} from './constants/particlesOptions';


const app = new Clarifai.App({
  apiKey: 'f8177366b43e4715814679343493853c'
 });

class App extends Component {
constructor(){
  super()
  this.state={
    input:'',
    imageURL:''
  }
};

onInputChange=(event)=>{
console.log(event.target.value)
this.setState({input:event.target.value})

}

onButtonSubmit=()=>{
  console.log('submitted')
  this.setState({imageURL:this.state.input})
  app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
  .then(
    function(response) {
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box)// do something with response
    },
    function(err) {
      // there was an error
    }
  );
}
  render() {
    return (
      <div className="App">
        <Particles id="tsparticles"
          options={particlesOptions}
        />

        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <Facerecognition imageURL={this.state.imageURL}/>
      </div>
    )

  }
}


export default App;
