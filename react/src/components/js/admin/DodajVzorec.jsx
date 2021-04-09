import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "./../common/formComponents/Input";
import "../../css/forms.css";

const Vzorci = ({}) => {
  const [vzorec, setVzorec] = useState("");

  return (
    <React.Fragment>
      <Input
        name="vzorec"
        label="Nov vzorec: "
        value={vzorec}
        onChange={(v) => setVzorec(v.target.value)}
      />
      <button
        onClick={() =>
          vzorec.length > 0
            ? axios
                .post(`${process.env.REACT_APP_SERVER_ADDRESS}/addPattern`, {
                  vzorec,
                })
                .then((res) => {
                  if (res.data.success) {
                    toast.success(res.data.message, {
                      position: "top-center",
                      autoClose: 3000,
                    });
                  } else {
                    toast.error(res.data.message, {
                      position: "top-center",
                      autoClose: 3000,
                    });
                  }
                })
            : toast.error("Vzorec ne sme biti prazen", {
                position: "top-center",
                autoClose: 3000,
              })
        }
        className="search_button"
      >
        Dodaj
      </button>
    </React.Fragment>
  );
};

export default Vzorci;
