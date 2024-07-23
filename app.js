require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/add-to-group', async (req, res) => {
    const identifier = req.body.identifier;

    try {
        // Authenticate with Docker Hub API
        const authResponse = await axios.post('https://hub.docker.com/v2/users/login/', {
            username: process.env.DOCKER_HUB_USERNAME,
            password: process.env.DOCKER_HUB_PASSWORD
        });

        const token = authResponse.data.token;

        const groupResponse = await axios.post(
            `https://hub.docker.com/v2/orgs/${process.env.DOCKER_HUB_ORG}/groups/${process.env.DOCKER_HUB_GROUP}/members/`,
             {
                member: `${identifier}`
             },
             {
                headers: {
                    Authorization: `JWT ${token}`
                },
             }
        );

        res.send(`Successfully added ${identifier} to the group.`);
    } catch (error) {
        console.error(error);
        res.send('An error occurred while adding the user to the group.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
