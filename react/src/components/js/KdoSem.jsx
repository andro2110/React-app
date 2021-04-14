import React, { Component } from "react";
import "../css/kdosem.css";
import drawingGirl from "../img/DrawingGirl.svg";

class Opis extends Component {
  state = {};
  render() {
    return (
      <div className="opis_wrapper" id="kdoSem">
        <div className="opis_wrapper2">
          <h1>Kdo sem?</h1>
          <div className="box">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic in
              voluptates quod quia nobis quas corporis, cumque voluptatum natus
              quo eum assumenda corrupti beatae, fugiat earum sint nostrum
              alias. Quidem veniam consequuntur nesciunt sed sit, debitis
              suscipit alias odit nam soluta commodi similique, natus error
              repudiandae mollitia. Vitae voluptas beatae doloribus ex? Ratione
              dignissimos consectetur officiis facilis maxime ea quos
              laboriosam. Porro quas aliquam eum? Za naročanje kliknite{" "}
              <a href="/narocila">tukaj</a>
            </p>
            <div className="img">
              <img src={drawingGirl} alt="drawingGirl" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Opis;
