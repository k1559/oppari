import React, { Component } from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiContants";
import DataTable from "./data-table";

export default class Marks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersCollection: [],
      userid: "",
      useremail: "",
    };
  }

  componentDidMount() {
    axios
      .get(API_BASE_URL + "/user/me", {
        headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
      })
      .then((res) => {
        this.setState({
          userid: res.data.response,
          useremail: res.data.email,
        });
        //console.log(this.state.userid + " data 2");
        axios
          .get(API_BASE_URL + "/mark/getAll", {
            params: {
              userid: this.state.userid,
              useremail: this.state.useremail,
            },
          })
          .then((res) => {
            this.setState({ usersCollection: res.data });
            //console.log(this.state.userid);
          })
          .catch(function (error) {
            window.alert(
              "Sessio aikakatkaistu. Palautetaan sisäänkirjautumiseen."
            );
            console.log(error);
          });
      });
  }

  dataTable() {
    return this.state.usersCollection.map((data, i) => {
      return <DataTable obj={data} key={i} />;
    });
  }

  render() {
    return (
      <div className="card card-right col-11 col-lg-5">
        <h3 className="valiotsikko">
          Poista tunteja (viimeiset 10 merkkausta)
        </h3>

        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <td>Tunnit</td>
              <td>Minuutit</td>
              <td>PVM(US)</td>
              <td>Lisätiedot</td>
              <td>Poista</td>
            </tr>
          </thead>

          <tbody>{this.dataTable()}</tbody>
        </table>
      </div>
    );
  }
}
