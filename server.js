//const express = require('express');
//const app = express();
const fs = require('fs');
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const defaultMiddleware = jsonServer.defaults();
const moment = require('moment');
const Hashids = require('hashids/cjs');
const hashids = new Hashids();

server.use(jsonServer.bodyParser);
server.use(defaultMiddleware);

const routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'routes.json')));
server.use(jsonServer.rewriter(routes));

const router = jsonServer.router(path.join(__dirname, 'db.json'));

server.use((req, res, next) => {
    
    if (req.url.includes('/messages') && req.method === 'POST') {

        const mailboxes = router.db.get('mailboxes').valueOf();
        const toMailbox = mailboxes.find(mb => mb.mailAddress === req.body.to);

        req.body.body = req.body.message;
        delete req.body.message;
        delete req.body.to;

        req.body.labelId = null;
        req.body.received = moment().format();
        req.body.isDeleted = 0;
        req.body.mailboxId = toMailbox !== undefined ? toMailbox.id : 0;
    }

    if (req.url.includes('/setlabel') && req.method === 'PUT') {
      const mailboxes = router.db.get('mailboxes').valueOf();
      const selectedMailbox = mailboxes.find(mb => mb.id === req.body.id);
      if (!selectedMailbox) {
        return res.status(404).json({ errors: [ { error: "Mailbox not found" } ] });
      };

      const messages = router.db.get('messages').valueOf();
      const selectedMessage = messages.find(msg => msg.id === req.body.messageid);
      if (!selectedMessage) {
        return res.status(404).json({ errors: [ { error: "Message not found" } ] });
      };

      const labels = router.db.get('labels').valueOf();
      const selectedLabel = labels.find(lb => lb.id === req.body.labelid);
      if (!selectedLabel) {
        return res.status(404).json({ errors: [ { error: "Label not found" } ] });
      };

      selectedMessage.labelId = req.body.labelid;
      delete req.body.labelid;
      delete req.body.messageid;
      delete req.body.id;
    }

    if (req.url.includes('/removelabel') && req.method === 'PUT') {
      const mailboxes = router.db.get('mailboxes').valueOf();
      const selectedMailbox = mailboxes.find(mb => mb.id === req.body.id);
      if (!selectedMailbox) {
        return res.status(404).json({ errors: [ { error: "Mailbox not found" } ] });
      };

      const messages = router.db.get('messages').valueOf();
      const selectedMessage = messages.find(msg => msg.id === req.body.messageid);
      if (!selectedMessage) {
        return res.status(404).json({ errors: [ { error: "Message not found" } ] });
      };

      selectedMessage.labelId = null;
      delete req.body.labelid;
      delete req.body.messageid;
      delete req.body.id;
    }

    if (req.url.includes('/delete') && (req.method === 'PUT' || req.method === 'DELETE')) {
      const mailboxes = router.db.get('mailboxes').valueOf();
      const selectedMailbox = mailboxes.find(mb => mb.id === req.body.id);
      if (!selectedMailbox) {
        return res.status(404).json({ errors: [ { error: "Mailbox not found" } ] });
      };

      const messages = router.db.get('messages').valueOf();
      const selectedMessage = messages.find(msg => msg.id === req.body.messageid);
      if (!selectedMessage) {
        return res.status(404).json({ errors: [ { error: "Message not found" } ] });
      };

      selectedMessage.isDeleted = 1;
      delete req.body.messageid;
      delete req.body.id;
    }

    if (req.url.includes('/recover') && (req.method === 'PUT' || req.method === 'DELETE')) {
      const mailboxes = router.db.get('mailboxes').valueOf();
      const selectedMailbox = mailboxes.find(mb => mb.id === req.body.id);
      if (!selectedMailbox) {
        return res.status(404).json({ errors: [ { error: "Mailbox not found" } ] });
      };

      const messages = router.db.get('messages').valueOf();
      const selectedMessage = messages.find(msg => msg.id === req.body.messageid);
      if (!selectedMessage) {
        return res.status(404).json({ errors: [ { error: "Message not found" } ] });
      };

      selectedMessage.isDeleted = 0;
      delete req.body.messageid;
      delete req.body.id;
    }

    // Continue to JSON Server router
    next();
  });

server.use(router);

server.listen(process.env.PORT || 3000, () => {
  console.log('JSON Server is running');
});