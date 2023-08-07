import Navbar from "./components/Navbar";
import Panels from "./components/Panels";
import Canvas from "./components/Canvas";
import RevealSlides from "./components/RevealSlides";
import Footer from "./components/Footer";
import Toolbox from "./components/Toolbox";
import EditorContainer from "./components/EditorContainer";

const PresentationEditor = () => {
  return (
    <EditorContainer>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Panels />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Toolbox />
          {/* <RevealSlides /> */}
          <Canvas />
          <Footer />
        </div>
      </div>
    </EditorContainer>
  );
};

export default PresentationEditor;
