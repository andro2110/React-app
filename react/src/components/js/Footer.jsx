import React, { Component } from "react";
import clock from "../img/Ura.svg";
import slusalka from "../img/Telefon.svg";
import ig from "../img/Instagram.svg";
import fb from "../img/Facebook.svg";
import mail from "../img/Mail.svg";
import "../css/Footer.css";

class Footer extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="Footer">
          <div className="kontakti">
            <div className="delovniCas">
              <div className="ura">
                <img src={clock} alt="ura" />
              </div>
              <div className="delovniCas">
                <p>Pomoč preko telefona od x - y na:</p>
              </div>
            </div>

            <div className="telefon">
              <img src={slusalka} alt="slusalka" />
              <p className="telStev">16551154</p>
            </div>
          </div>

          <div className="container">
            <div className="rect kontakti1">
              <h1>Kontaktni podatki</h1>

              <div className="icons">
                <img src={ig} alt="instagram" />
                <img src={fb} alt="facebook" />
                <img src={mail} alt="gmail" />
              </div>
            </div>

            <div className="rect pogoji">
              <h1>Pogoji poslovanja</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
                eaque ad voluptates ut, aliquid, totam eos eius rem impedit
                cupiditate omnis nihil veritatis quos eveniet adipisci facilis
                alias tempore temporibus.
              </p>
            </div>

            <div className="rect osPodatki">
              <h1>Varstvo osebnih podatkov</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
                similique doloribus nam eum. Pariatur voluptas sint ipsum fuga
                laudantium voluptatem quod obcaecati quos! Nihil numquam quia
                similique? Nostrum, aspernatur unde?
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Footer;
