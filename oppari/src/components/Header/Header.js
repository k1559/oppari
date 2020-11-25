import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../../constants/apiContants";
function Header(props) {

  const [state, setState] = useState({
    admin: "",
    check: ""
  });

  useEffect(() => {
    //console.log(localStorage.getItem(ACCESS_TOKEN_NAME));
    if(localStorage.getItem(ACCESS_TOKEN_NAME) !== null){
      checkAdmin();
    }
  });

  function checkAdmin() {
    if(localStorage.getItem(ACCESS_TOKEN_NAME) !== "undefined"){
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

    if(obj.user.admin !== true && state.check === ""){
      setState({
        admin: false,
        check: true
      })
    }
  }
  }

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  let title = capitalize(
    props.location.pathname.substring(1, props.location.pathname.length)
  );
  if (props.location.pathname === "/") {
    title = "Tervetuloa";
  }
  if (props.location.pathname === "/login") {
    title = "Tervetuloa";
  }
  if (props.location.pathname === "/profile") {
    title = "Profiili";
  }
  if (props.location.pathname === "/home") {
    title = "Etusivu";
  }
  if (props.location.pathname === "/tarkastele") {
    title = "Tarkastele";
  }
  if (props.location.pathname === "/admin") {
    title = "Admin";
  }
  function renderLogout() {
    if (
      props.location.pathname === "/profile" ||
      props.location.pathname === "/home" ||
      props.location.pathname === "/tarkastele" ||
      props.location.pathname === "/admin"
    ) {
      return (
        <div className="ml-auto">
          <button className="btn btn-danger valikkobutton" onClick={() => handleLogout()}>
            Kirjaudu ulos
          </button>
        </div>
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    props.history.push("/login");
  }

  function redirectProfile() {
    if (
      props.location.pathname === "/home" ||
      props.location.pathname === "/tarkastele" ||
      props.location.pathname === "/admin"
    ) {
      return <span className="h3 valikko" onClick={() => profiiliin()}>Profiili</span>;
    }
  }

  function redirectAdmin() {
    if (
      props.location.pathname === "/profile" ||
      props.location.pathname === "/tarkastele" ||
      props.location.pathname === "/home"
    )
     {
      //console.log(state.admin);
      if(state.admin !== false) {
      return <span className="h3 valikko" onClick={() => adminiin()}>Admin</span>;
    }
    }
  }
  function adminiin() {
    props.history.push("/admin");
  }

  function profiiliin() {
    props.history.push("/profile");
  }

  function redirectTarkastele() {
    if (
      props.location.pathname === "/home" ||
      props.location.pathname === "/profile" ||
      props.location.pathname === "/admin"
    ) {
      return <span className="h3 valikko" onClick={() => tarkasteluun()}>Tarkastele</span>;
    }
  }
  function tarkasteluun() {
    props.history.push("/tarkastele");
  }

  function redirectHome() {
    if (
      props.location.pathname === "/profile" ||
      props.location.pathname === "/tarkastele" ||
      props.location.pathname === "/admin"
    ) {
      return <span className="h3 valikko" onClick={() => kotiin()}>Kotiin</span>;
    }
  }
  function kotiin() {
    props.history.push("/home");
  }

  return (
    <nav className="row navbar navbar-dark bg-primary justify-content-start d-flex align-items-center text-red headertext">
      <div className="col-12 col-lg-2 headerlogo" onClick={() => kotiin()}>
      </div>
      <div className="col-12 col-lg-1">
        <span className="h3 valikonotsikko">{props.title || title}</span>
        </div>
        <div className="col-12 col-lg-6 valikkolinkit"> 
        {redirectHome()}
        {redirectProfile()}
        {redirectTarkastele()}
        {redirectAdmin()}
        </div>
        <div className="col-12 col-lg-3">
        {renderLogout()}
        </div>
      
    </nav>
  );
}
export default withRouter(Header);
