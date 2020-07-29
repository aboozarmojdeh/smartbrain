import React, { Component } from "react";
import Clarifai from "clarifai";
// import Particles from 'react-particles-js';
import Particles from "react-tsparticles";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Facerecognition from "./components/Facerecognition/Facerecognition";
import Signin from "./components/Signin/Signin";
import "./App.css";
import { particlesOptions } from "./constants/particlesOptions";

const app = new Clarifai.App({
  apiKey: "f8177366b43e4715814679343493853c",
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
      box: {},
      route: "signin",
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  dispalyFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    console.log("submitted");
    this.setState({ imageURL: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.dispalyFaceBox(this.calculateFaceLocation(response)).catch((err) =>
          console.log(err)
        )
      );
  };


  onRouteChange=(route)=>{
    this.setState({route:route})
  }
  render() {
    return (
      <div className="App">
        <Particles id="tsparticles" options={particlesOptions} />
        {this.state.route === "signin" ? (
          <Signin onRouteChange={this.onRouteChange}/>
        ) : (
          <div>
            <Navigation onRouteChange={this.onRouteChange}/>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <Facerecognition
              imageURL={this.state.imageURL}
              box={this.state.box}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
