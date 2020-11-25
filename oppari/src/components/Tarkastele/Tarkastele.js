import React, { useEffect} from "react";
import MarksBetweenDate from '../MarksBetweenDate/MarksBetweenDate';
import {ACCESS_TOKEN_NAME, API_BASE_URL } from "../../constants/apiContants";
import Axios from "axios";
import Marks from '../AllMarks/AllMarks';
import Schedule from '../Schedule/Schedule';
import DELMarksBetweenDate from '../DELMarksBetweenDate/DELMarksBetweenDate';
import { withRouter } from 'react-router-dom';

function Tarkastele(props) {

    useEffect(() => {
        Axios.get(API_BASE_URL + "/user/me", {
          headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
        })
        .then(function(response) {
          //console.log(response);
          if(response.status !== 200) {
            redirectToLogin();
          }
        })
        .catch(function (error) {
          window.alert("Sessio aikakatkaistu. Palautetaan sisäänkirjautumiseen.");
          redirectToLogin();
        })
      });
    
      function redirectToLogin() {
        props.history.push("/login");
      }



        return (
            <div className="row justify-content-around">
            <Schedule />
           <MarksBetweenDate />
           <Marks/>
           <DELMarksBetweenDate />
           </div>
        );
}

export default withRouter(Tarkastele);