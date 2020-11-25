import React, { useEffect} from "react";
import {ACCESS_TOKEN_NAME, API_BASE_URL } from "../../constants/apiContants";
import { withRouter } from "react-router-dom";
import AdminMarks from '../AdminMarks/AdminMarks';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import Axios from "axios";


function Admin(props) {

  useEffect(() => {
    checkAdmin();
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

  function checkAdmin() {
    var base64Url = localStorage.getItem(ACCESS_TOKEN_NAME).split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    //console.log(jsonPayload);
    var obj = JSON.parse(jsonPayload);

    //console.log(jsonPayload);
    //console.log(obj);
    //console.log(obj.user.admin);

    if(obj.user.admin !== true){
      redirectToHome();
    }
 
  }

  function redirectToHome() {
        props.history.push("/home");
    }

  return (
    <div className="row justify-content-around">
      
      <AdminMarks/>
      <RegistrationForm />
    </div>
  );
}
export default withRouter(Admin);
