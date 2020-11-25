import React, { Component } from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiContants";
import DataTable from "./data-table";

export default class HoursToday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersCollection: [],
      userid: "",
      useremail: "",
    };
  }

  componentDidMount() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    //console.log(today);
    this.setState({
      pvm: today
    })
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
        //console.log(this.state.pvm);
        axios
          .get(API_BASE_URL + "/mark/getHourstoday", {
            params: {
              useremail: this.state.useremail,
              pvm: this.state.pvm,
            },
          })
          .then((res) => {
            //console.log(res);
            this.setState({
              response: res.data,
              tuntiarray: [],
              minuuttiarray: [],
              usersCollection: res.data,
            });
            
            var arraylength = this.state.response.length;
            let tuntisumma = 0;
            let minuuttisumma = 0;
            for (var i = 0; i < arraylength; i++) {
              this.state.tuntiarray.push(this.state.response[i].hours);
              this.state.minuuttiarray.push(this.state.response[i].minutes);
              //console.log(this.state.tuntiarray);
              //console.log(this.state.minuuttiarray);
              tuntisumma += this.state.response[i].hours;
              minuuttisumma += this.state.response[i].minutes;
            }
            function time_convert(num) {
              var hours = Math.floor(num / 60);
              var minutes = num % 60;
              return {
                hours: hours,
                minutes: minutes,
              };
            }
  
            if (minuuttisumma >= 60) {
              //console.log(time_convert(minuuttisumma));
              var minuutit = time_convert(minuuttisumma);
              var ekstratunnit = minuutit.hours;
              var ekstraminuutit = minuutit.minutes;
              if (ekstratunnit > 0) {
                tuntisumma = tuntisumma + ekstratunnit;
                this.setState({
                  minuutit: ekstraminuutit,
                  tunnit: tuntisumma,
                });
                //console.log(tuntisumma);
                //console.log(ekstraminuutit);
                //console.log("Töitä on tehty tänä aikana yhteensä " + tuntisumma + " tuntia ja " + ekstraminuutit + " minuuttia.");
              }
            } else {
              this.setState({
                minuutit: minuuttisumma,
                tunnit: tuntisumma,
              });
            }
          })
          .catch(function (error) {
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
      <div className="wrapper">
        <div className="container col-12">
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
          <h3>
            Tänään olet tehnyt töitä {this.state.tunnit} tuntia ja{" "}
            {this.state.minuutit} minuuttia.
          </h3>
        </div>
      </div>
    );
  }
}
