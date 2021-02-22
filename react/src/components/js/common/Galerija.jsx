import Carousel from "react-elastic-carousel";
import Imgcard from "./ImageCard";
import "../../css/Gallery.css";

const Galerija = ({ slike, loaded }) => {
  return loaded ? (
    <Carousel className="carousel">
      {slike.map((s, i) => {
        return <Imgcard slika={s} key={i} />;
      })}
    </Carousel>
  ) : null;
};

export default Galerija;
