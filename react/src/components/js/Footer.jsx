import React, { Component } from "react";
import clock from "../img/Ura.svg";
import slusalka from "../img/Telefon.svg";
import ig from "../img/Instagram.svg";
import fb from "../img/Facebook.svg";
import mail from "../img/gmail.svg";
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
                <p>Pomoč preko telefona od 14:00 do 21:00 na:</p>
              </div>
            </div>

            <div className="telefon">
              <img src={slusalka} alt="slusalka" />
              <p className="telStev">+434 34 44 32 324 </p>
            </div>
          </div>

          <div className="container">
            <div className="rect kontakti1">
              <h1>Kontaktni podatki</h1>

              <div className="icons">
                <a href="http://www.google.com">
                  <img src={ig} className="imgLinks" alt="Instagram" />
                </a>

                <a href="http://www.google.com">
                  <img src={fb} className="imgLinks" alt="Facebook" />
                </a>

                <a href="http://www.google.com">
                  <img src={mail} className="imgLinks" alt="Gmail" />
                </a>
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
