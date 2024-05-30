const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

let formData = [];
function randomIdGenerator() {
  let randomID = Math.floor(Math.random() * 1000 + 1);
  return randomID;
}

// get request to home
app.get("/", (req, res) => {
  res.status(200).render("home", {
    data: formData,
  });
});

// get specific user data
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  let userData;
  let userFound = false;
  formData.forEach((element, index) => {
    if (element.id == id) {
      userData = formData[index];
      console.log(`User id: ${id} data is `);
      userFound = true;
      res.status(200).send(userData);
    }
  });
  if (!userFound) {
    res.status(404).json({
      message: `User id: ${id} not found `,
    });
  }

  //res.status(200).send(formData)
});

// post request to submit data
app.post("/submit", (req, res) => {
  const body = req.body;

  function generateUniqueID() {
    let id;
    let uniqueID = false;
    while (!uniqueID) {
      id = randomIdGenerator();
      uniqueID = !formData.some((e) => e.id == id);
    }
    return id;
  }

  let id = generateUniqueID();
  body.id = id;
  formData.push(body);
  res.status(200).redirect("/");
});

// delete request api
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;

  formData.forEach((element, index) => {
    if (element.id == id) {
      formData.splice(index, 1);
      console.log("deleted user");
    }
  });

  res.status(200).redirect("/");
});

// edit request api
app.get("/edit/:email", (req, res) => {
  const email = req.params.email;

  let data = {};
  formData.forEach((element, index) => {
    if (element.email == email) {
      data.email = element.email;
      data.lname = element.lname;
      data.fname = element.fname;

      // console.log(data);
    }
  });
  res.status(200).render("edit", {
    data,
  });
});

// update api
app.post("/update/:email", (req, res) => {
  const emailID = req.params.email;
  const { fname, lname, email } = req.body;

  formData.forEach((element, index) => {
    if (element.email == emailID) {
      element.email = email;
      element.lname = lname;
      element.fname = fname;
      // console.log(element);

      console.log("Updated user");
    }
  });
  res.redirect("/");
});

app.listen(3000, () => {
  console.log(`Server listening : http://localhost:3000`);
});

app.use((req, res) => {
  res.status(404).send("Page Not Found || 404");
});
