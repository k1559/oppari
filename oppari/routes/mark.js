const express = require("express");
const router = express.Router();
const Mark = require("../model/Mark");
const Json2csvParser = require('json2csv').Parser;
const User = require("../model/User");


const fs = require("fs");
//const path = require('path')

/**
 * @method - POST
 * @param - /markhours
 * @description - Mark Registration
 */
router.post('/mark', (req, res) => {
        
    req.body.hours = parseInt(req.body.hours);
    let {
        hours,
        minutes,
        textarea,
        date,
        userid,
        useremail
    } = req.body

    date = new Date(date+"Z");

    let newMark = new Mark({
        hours,
        minutes,
        textarea,
        date,
        userid,
        useremail
    }); newMark.save().then(mark => {
        return res.status(201).json({
            success: true,
            msg: "Mark is now added",
        });
    });
});

/*
router.route('/getAll').get((req, res) => {
    //console.log(req.params);
    const userid = req.query.userid;
    const hours = req.query.hours;
    const useremail = req.query.useremail;

    //console.log(userid);
    //console.log(hours);

    Mark.find({'useremail': useremail},(error, data) => {
        if (error) {
            return (error)
        } else {
            res.json(data)
        }
    })
})
*/
router.route('/getAll').get((req, res) => {
    const useremail = req.query.useremail

    Mark.find({'useremail': useremail}).limit(10).sort({date: 'descending'}).exec((err, data) => {
        if (err) {
            return (err)
        } else {
            res.json(data)
        }
    })
})

router.route('/betweendate').get((req, res) => {
    //console.log(req.params);
    let pvm1 = req.query.pvm1;
    let pvm2 = req.query.pvm2;
    const userid = req.query.userid;
    //console.log(userid);
    //console.log(hours);
    pvm2 = new Date(pvm2+"Z");
    pvm1 = new Date(pvm1+"Z");
    //console.log(pvm1);
    //console.log(pvm2);

    Mark.find({'userid': userid, 'date': {$gte: pvm1, $lte: pvm2}},(error, data) => {
        if (error) {
            console.log(error);
            return (error)
        } else {
            //console.log(data);
            res.json(data)
            //console.log(data);
        }
    })
})

router.route('/adminbetweendate').get((req, res) => {
    //console.log(req.params);
    let pvm1 = req.query.pvm1;
    let pvm2 = req.query.pvm2;
    const useremail = req.query.useremail;
    pvm1 = new Date(pvm1+"Z");
    pvm2 = new Date(pvm2+"Z");
    let userid = "";
    //console.log(userid);
    //console.log(hours);
    User.find({'email': useremail}, (error, data) => {
        if(error) {
            console.log(error);
        } else {
            //console.log(data);
            userid = data[0]._id;     

            Mark.find({'userid': userid, 'date': {$gte: pvm1, $lt: pvm2}},(err, data) => {
                if (error) {
                    console.log(err);
                    return (err)
                } else {
                    res.json(data)
                    //console.log(data);
                }
            })
        }
    })
    
})

router.route('/getHoursToday').get((req, res) => {
    const useremail = req.query.useremail;
    let pvm = req.query.pvm;
    pvm = new Date(pvm+"Z");

    Mark.find({'date':pvm, 'useremail': useremail},(error, data) => {
        if (error) {
            return (error)
        } else {
            res.json(data)
        }
    })
})

router.route('/remove').get((req, res) => {
        
    const markid = req.query.markid;
    //console.log(markid);

    Mark.deleteOne({_id: markid}, function(err, obj) {
        if (err) throw err;
        //console.log("1 mark deleted");
    });

});


router.route('/download').get((req, res) => {

    const userid = req.query.userid;
    let pvm1 = req.query.pvm1;
    let pvm2 = req.query.pvm2;
    pvm1 = new Date(pvm1+"Z");
    pvm2 = new Date(pvm2+"Z");
    Mark.find({'userid':userid, 'date':{$gte: pvm1, $lt: pvm2}}).lean().exec(function (err, data) {
        if(err) {
            return (err)
        } else {
            //let testi = JSON.stringify(data);
            //console.log(testi);
            let csv;
            try {
                const csvFields = ['_id', 'hours', 'minutes', 'textarea', 'date', 'userid', 'useremail'];
                const json2csvParser = new Json2csvParser({csvFields});
                csv = json2csvParser.parse(data);
                //console.log(csv);
            }
            catch (err) {
                return res.status(500).json({err});
            }
            fs.writeFile("../oppari/public/files/" + userid +".csv" , csv, (err) => {
                if (err) {
                    console.log("Rippendahlen");
                    return res.json(err).status(500);
                }
                else {
                    //console.log("tiedoston luominen onnistui");
                    return res.json(`/exports/${userid}.csv`);
                }
            })
        }
 
    })

})

router.route('/admindownload').get((req, res) => {
    //console.log(req.params);
    let pvm1 = req.query.pvm1;
    let pvm2 = req.query.pvm2;
    const useremail = req.query.useremail;
    pvm1 = new Date(pvm1+"Z");
    pvm2 = new Date(pvm2+"Z");
    let userid = "";
    //console.log(userid);
    //console.log(hours);
    User.find({'email': useremail}, (error, data) => {
        if(error) {
            console.log(error);
        } else {
            //console.log(data);
            userid = data[0]._id;     

            Mark.find({'userid':userid, 'date':{$gte: pvm1, $lt: pvm2}}).lean().exec(function (err, data) {
                if(err) {
                    return (err)
                } else {
                    //let testi = JSON.stringify(data);
                    //console.log(testi);
                    let csv;
                    try {
                        const csvFields = ['_id', 'hours', 'minutes', 'textarea', 'date', 'userid', 'useremail'];
                        const json2csvParser = new Json2csvParser({csvFields});
                        csv = json2csvParser.parse(data);
                        //console.log(csv);
                    }
                    catch (err) {
                        return res.status(500).json({err});
                    }
                    fs.writeFile("../oppari/public/files/" + userid +".csv" , csv, (err) => {
                        if (err) {
                            console.log("Rippendahlen");
                            return res.json(err).status(500);
                        }
                        else {
                            console.log("tiedoston luominen onnistui");
                            return res.json(`/exports/${userid}.csv`);
                        }
                    })
                }
         
            })
        }
    })
    
})

module.exports = router;