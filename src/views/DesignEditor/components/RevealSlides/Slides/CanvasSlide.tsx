import React from "react";
import Slide from "./Slide";
import Canvas from "../../Canvas";

const CanvasSlide = () =>
  <Slide transition="fade">
    <Canvas />
  </Slide>;

export default CanvasSlide;
