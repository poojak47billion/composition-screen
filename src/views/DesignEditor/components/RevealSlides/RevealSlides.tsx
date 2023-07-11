import Deck from "./Deck"
import Slides from './Slides';
import revealOptions from "./revealOptions";
const RevealSlides = () => { return <><Deck revealOptions={ revealOptions}>{ Slides}</Deck></> }
export default RevealSlides;