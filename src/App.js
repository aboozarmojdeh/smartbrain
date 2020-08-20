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
import Register from "./components/Register/Register";
import "./App.css";
import { particlesOptions } from "./constants/particlesOptions";

const app = new Clarifai.App({
  apiKey: "f8177366b43e4715814679343493853c",
});

const initialState={
  input: "",
  imageURL: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }



  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //   .then(response=>response.json())
  //   .then(data=>console.log('GET /',data))
  // }
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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
      .then((response) =>{
        if(response){
          fetch('http://localhost:3000/image',{
      method:'put',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        id:this.state.user.id
      })
    })
    .then(response=>response.json())
    .then(count=>{
      this.setState(Object.assign(this.state.user,{entries:count}))
    })
    .catch(err=>console.log(err))
        }
        this.dispalyFaceBox(this.calculateFaceLocation(response))
      })
      .catch((err) =>
          console.log(err)
        )
      
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
   const {isSignedIn, imageURL,route,box}=this.state;
    return (
      <div className="App">
        <Particles id="tsparticles" options={particlesOptions} />
      
          
          
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
            {route === "home" ? (
              <div>
            
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <Facerecognition
              imageURL={imageURL}
              box={box}
            />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
