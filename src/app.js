const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

require("./db/conn");
const Register = require("./models/registers");
const Jobcreation = require("./models/creatingjobs");
const { json } = require("express");
const { log } = require("console");

const port = process.env.PORT || 8089;

const static_path = path.join(__dirname, "../public" );
const template_path = path.join(__dirname, "../templates/views" );
const partials_path = path.join(__dirname, "../templates/partials" );

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/index", (req, res) => {
    res.render("index")
});
app.get("/register", (req, res) => {
    res.render("index")
});

app.get("/login", (req, res) => {

    res.render("index")
});

app.post("/register", async (req, res) => {

    try{
        
        const password = req.body.regPass;
        const confirmpassword = req.body.regCpass;

        if(password === confirmpassword) {
            const registerStudent = new Register({
                firstname : req.body.regFname,
                lastname : req.body.regLname,
                email : req.body.regEmail,
                phone : req.body.regMobile,
                age : req.body.regAge,
                password : req.body.regPass
            })

            const token = await registerStudent.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly:true
            })

            const registered = await registerStudent.save();
            res.render("home");

        } else {
            res.send("Password did not Match");
        }

    } catch (error){
        res.send(error);
    }

    
});

app.post("/login", async (req, res) => {

    try{
        
        const email = req.body.loginEmail;
        const password = req.body.loginPass;

        const username = await Register.findOne({email:email});
        
        const isMatch = await bcrypt.compare(password, username.password);

        const token = await username.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly:true
        })
        

        if(isMatch) {
            //const token = await username.generateAuthToken();
            res.render("home");

        } else {
            res.send("Email or Password is Wrong");
        }

    } catch (error){
        res.send(error);
    }

    //res.render("index")
});

app.get("/home", auth , (req, res) => {
    res.render("home");
    
});

app.get("/createjob", auth , (req, res) => {
    res.render("createjob");
});

app.get("/updatedelete", auth, (req, res) => {

    Jobcreation.find({ user_id: req.user._id },(err, docs) => {
        if (!err) {
            res.render("updatedelete", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

app.get("/viewjob", auth,  async (req, res) => {

    Jobcreation.find((err, docs) => {
        if (!err) {
            res.render("viewjob", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });

});

app.get("/logout", auth, async (req, res) => {
    try {
        
        //For Single user/device logout
        // req.user.tokens = req.user.tokens.filter((currentElement) =>{
        //     return currentElement.token !== req.token
        // })

        //For All user/device logout
        req.user.tokens = [];

        res.clearCookie("jwt");
        await req.user.save();
        res.render("index");

    } catch (error) {
        res.send(error);
    }
})

app.post("/createjob", auth , async (req, res) =>{
    try {
        console.log("On the way to create job!!");
        const createJob = new Jobcreation({

            user_id:req.user._id.toString(),
            industry:req.body.industry,
            jobtype:req.body.jobtype,
            jobfield:req.body.jobfield,
            jobdescrip:req.body.jobdescrip,
            highqualification:req.body.highqualification,
            salary:req.body.salary,
            jobcontact:req.body.jobcontact

        })
        console.log("Job data assigned!!");
        const created = await createJob.save();
        console.log("Job Created!!!!!!!!!!!!");
        res.render("createjob");

    } catch (error) {
        res.send(error);
    }
});

app.get("/createjob/:id", auth , async (req, res) => {
    //console.log("Entered Inside Update");

    //const userid = await Register.findById(req.params.id);

    Jobcreation.findById(req.params.id, (err, doc) => {
        //console.log("Entered Inside ID");
        if (!err) {
            res.render("updatejob", {
                job: doc
            });
        }
    });
});

app.post("/updatejob", (req, res) => {

    Jobcreation.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        console.log("Entered One Update");
        if (!err) { 

            console.log("Entered ViewJob Update");
            res.redirect("viewjob"); 
        }
        else {
            if (err.name == 'ValidationError') {
                //handleValidationError(err, req.body);
                res.render("updatejob", {
                    job: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });

});


app.get("/delete/:id", auth , (req, res) => {
    
    Jobcreation.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('viewjob');
        }
        else { console.log('Error in employee delete :' + err); }
    });

});






app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
})