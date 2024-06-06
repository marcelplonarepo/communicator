

const prisma = require("../prisma/index");



module.exports.login = (req, res) => {

    prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500)
        })

}

module.exports.register = (req, res) => {


    const profileNumber = Math.floor(Math.random() * 10) + 1;

    const profileUrl = `http://localhost:5000/images/profile${profileNumber}.png`;

    prisma.user.create({
        data: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profile: profileUrl
        }
    })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500)
        })


}
