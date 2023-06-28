const database = require("./database");

const getUsers = (req, res) => {
    let sqlUser = "SELECT firstname, lastname, email, city, language FROM users";
    const sqlValuesUser = [];

    if (req.query.language != null) {
        sqlUser += " WHERE language = ?";
        sqlValuesUser.push(req.query.language);

        if (req.query.city != null) {
            sqlUser += " AND city = ?";
            sqlValuesUser.push(req.query.city)
        }
    } else if (req.query.city != null) {
        sqlUser += " WHERE city = ?"
        sqlValuesUser.push(req.query.city)
    }
    
    database
    .query(sqlUser, sqlValuesUser)
    .then(([users]) => {
        res.json(users);
    })
    .catch((err) => {
        res.status(500).send("Error retrieving data from database")
    });
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    database
    .query("SELECT firstname, lastname, email, city, language from users where id = ?", [id])
    .then(([users]) => {
        if (users[0] != null) {
            res.json(users [0]);
        } else {
            res.status(404).send("Not Found");
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database")
    })
};

const postUser = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;

    database
    .query(
        "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
       [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error saving user');
    })
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;
    
    database
    .query(
      "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? where id = ?",
      [firstname, lastname, email, city, language, hashedPassword, id]
      )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error editing the user");
    });
  }

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const { email } = req.body;

  database
    .query("select * from users where email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];

        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

module.exports = {
    getUsers,
    getUserById,
    postUser,
    updateUser,
    getUserByEmailWithPasswordAndPassToNext,
};