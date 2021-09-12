//const express = require('express');
//const app = express();
const fs = require('fs');
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const defaultMiddleware = jsonServer.defaults();
const moment = require('moment');

//const { validate, ValidationError, Joi } = require('express-validation');
const { check, validationResult, ValidationChain } = require('express-validator');

server.use(jsonServer.bodyParser);
server.use(defaultMiddleware);

const routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'routes.json')));
server.use(jsonServer.rewriter(routes));

const router = jsonServer.router(path.join(__dirname, 'db.json'));

const sendMessageValidator = [
  check('from').notEmpty().isEmail().withMessage("'From' must be a valid email address"),
  check('to').notEmpty().isEmail().withMessage("'To' must be a valid email address"),
  check('subject').notEmpty().withMessage("'Subject' is required"),
  check('message').notEmpty().withMessage("'Message' is required")
];

server.use(sendMessageValidator, (req, res, next) => {
    
    if (req.url.includes('/messages') && req.method === 'POST') {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        };

        const mailboxes = router.db.get('mailboxes').valueOf();
        const toMailbox = mailboxes.find(mb => mb.mailAddress === req.body.to);

        req.body.body = req.body.message;
        delete req.body.message;
        delete req.body.to;

        req.body.received = moment().format();
        req.body.isDeleted = 0;
        req.body.mailboxId = toMailbox !== undefined ? toMailbox.id : 0;
    }

    // Continue to JSON Server router
    next();
  });

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});