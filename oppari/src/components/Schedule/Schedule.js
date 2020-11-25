import * as React from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiContants";


import { ScheduleComponent, Week, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';


export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    let today = new Date();
    today.setHours(0,0,0,0);
    this.state = {
      marksArray: [],
      today: today
    };
  }

  componentDidMount() {
    axios
      .get(API_BASE_URL + "/user/me", {
        headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
      })
      .then((res) => {
        //console.log(res);
        this.setState({
          userid: res.data.response,
          useremail: res.data.email
        }) 
        //console.log(this.state.userid + " data 2");
        axios
          .get(API_BASE_URL + "/mark/getAll", {
            params: {
              userid: this.state.userid,
              useremail: this.state.useremail,
            },
          })
          .then((res) => {
            this.setState({ marksArray: res.data, marksArrayParsed: [] });

            let arraylength = this.state.marksArray.length;
            let i = 0;
            //console.log(this.state.marksArray);

            for (i = 0; i < arraylength; i++) {
             
                //this.state.marksArray[i].date = new Date();
                const dateparsed = Date.parse(this.state.marksArray[i].date);
                var y = new Date(dateparsed);
                //console.log(dateparsed);
                //var time = dateparsed.getTime();
                //console.log(this.state.marksArray[i].textarea);
                var hours = this.state.marksArray[i].hours;
                var minutes = this.state.marksArray[i].minutes;
                let secondDate = new Date(
                  y.getFullYear(),
                  y.getMonth(),
                  y.getDate(),
                  y.getHours() + hours, 
                  y.getMinutes()+ minutes 
                );
                //console.log(secondDate);
                let teksti = this.state.marksArray[i].textarea;
                if(teksti === undefined) {
                  teksti = " ";
                }
    
                let item = [];
                item.Id = this.state.marksArray[i]._id;
                item.Subject = teksti +" " + hours + "h " + minutes + " min" ;
                //console.log(this.state.marksArray[i].textarea);
                item.StartTime = this.state.marksArray[i].date;
                item.EndTime = secondDate;
                this.state.marksArrayParsed.push(item);
              
            }
            //console.log(new Date(2020, 10, 5, 9, 30));
            //console.log(this.state.marksArrayParsed);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function(error) {
        console.log(error);
        window.alert("Kirjaudu sisään uudestaan");
      });
  }
  

  render() {
    return (
      <div className="schedule col-lg-12 col-12 col-xl-8">
      <ScheduleComponent
        height="430px"
        selectedDate={this.state.today}
        eventSettings={{ dataSource: this.state.marksArrayParsed }}
        readonly={true}
        timeScale={{ enable: false }}
      >
        
        <ViewsDirective>
              <ViewDirective option='Month'/>
              <ViewDirective option='Week' firstDayOfWeek={1} dateFormat='dd/MM/yyyy'/>
              <ViewDirective option='Today'/>
            </ViewsDirective>
        <Inject services={[Month, Week]} />
      </ScheduleComponent>
      </div>
    );
    
  }
}
