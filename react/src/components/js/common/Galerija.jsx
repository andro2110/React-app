import Carousel from "react-elastic-carousel";
import Imgcard from "./ImageCard";
import "../../css/Gallery.css";

const Galerija = ({ slike }) => {
  return (
    <Carousel className="carousel">
      {slike.map((s, i) => {
        return <Imgcard slika={s} key={i} />;
      })}
    </Carousel>
  );
};

export default Galerija;
