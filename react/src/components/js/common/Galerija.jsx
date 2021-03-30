import Carousel from "react-elastic-carousel";
import Imgcard from "./ImageCard";
import "../../css/carousel.css";

const Galerija = ({ slike, loaded }) => {
  if (loaded && slike.length > 0) {
    return (
      <Carousel className="carousel p-3">
        {slike.map((s, i) => {
          return <Imgcard slika={s} key={i} />;
        })}
      </Carousel>
    );
  } else {
    return <h1>Uporabnik ni poslal slike</h1>;
  }
};

export default Galerija;
