# email-api

An email API that keeps track of imaginary inboxes and the emails that get sent between the inboxes.

## Run the app

    node server.js

## API endpoints

The endpoints for this REST API are as follows:

## Get list of Mailboxes

### Request

`GET /mailboxes/`

    curl -i -H 'Accept: application/json' http://localhost:3000/mailboxes/

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 1,
            "mailAddress": "thoba@sample1.com"
        },
        {
            "id": 2,
            "mailAddress": "thoba@sample2.com"
        }
    ]

## Get a Mailbox

### Request

`GET /mailboxes/id`

    curl -i -H 'Accept: application/json' http://localhost:3000/mailboxes/1

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 1,
        "mailAddress": "thoba@sample1.com"
    }

## Get a Mailbox and its messages

### Request

`GET /mailboxes/id/messages`

    curl -i -H 'Accept: application/json' http://localhost:3000/mailboxes/1/messages

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 1,
        "mailAddress": "thoba@sample1.com",
        "messages": [
            {
            "id": 1,
            "mailboxId": 1,
            "labelId": 1,
            "received": "2021-09-10T10:00:00",
            "from": "thoba@sample2.com",
            "subject": "Coffee",
            "body": "Hey, want to grab a cup of coffee?",
            "isDeleted": 1
            },
            {
            "id": 3,
            "mailboxId": 1,
            "labelId": 2,
            "received": "2021-09-11T06:00:00",
            "from": "thoba@sample2.com",
            "subject": "Leave Approval",
            "body": "Hey there, hope you're doing well. Please approve my leave request for Tuesday.",
            "isDeleted": 0
            },
            {
            "id": 5,
            "mailboxId": 1,
            "labelId": 2,
            "received": "2021-09-11T09:15:00",
            "from": "thoba@sample1.com",
            "subject": "RE: Leave Approval",
            "body": "Hello. I'm well thanks. Full-day leave please.",
            "isDeleted": 0
            },
            {
            "to": "thoba@sample1.com",
            "subject": "Test6",
            "message": "Testing6",
            "body": "Testing6",
            "received": "2021-09-12T17:55:47+02:00",
            "isDeleted": 0,
            "mailboxId": 1,
            "id": 15
            },
            {
            "to": "thoba@sample1.com",
            "subject": "Test7",
            "body": "Testing7",
            "received": "2021-09-12T17:58:49+02:00",
            "isDeleted": 0,
            "mailboxId": 1,
            "id": 16
            },
            {
            "from": "thoba@sample2.com",
            "subject": "Test8",
            "body": "Testing8",
            "received": "2021-09-12T18:31:45+02:00",
            "isDeleted": 0,
            "mailboxId": 1,
            "id": 17
            }
        ]
    }

## Get deleted messages of a mailbox

### Request

`GET /mailboxes/id/messages/deleted`

    curl -i -H 'Accept: application/json' http://localhost:3000/mailboxes/1/messages/deleted

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 1,
            "mailboxId": 1,
            "labelId": 1,
            "received": "2021-09-10T10:00:00",
            "from": "thoba@sample2.com",
            "subject": "Coffee",
            "body": "Hey, want to grab a cup of coffee?",
            "isDeleted": 1
        }
    ]

## Get messages from a specific email address within a mailbox

### Request

`GET /mailboxes/id/messages/from/from`

    curl -i -H 'Accept: application/json' http://localhost:3000/mailboxes/1/from/thoba@sample2.com

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    [

{
"id": 1,
"mailboxId": 1,
"labelId": 1,
"received": "2021-09-10T10:00:00",
"from": "thoba@sample2.com",
"subject": "Coffee",
"body": "Hey, want to grab a cup of coffee?",
"isDeleted": 1
},
{
"id": 3,
"mailboxId": 1,
"labelId": 2,
"received": "2021-09-11T06:00:00",
"from": "thoba@sample2.com",
"subject": "Leave Approval",
"body": "Hey there, hope you're doing well. Please approve my leave request for Tuesday.",
"isDeleted": 0
},
{
"from": "thoba@sample2.com",
"subject": "Test8",
"body": "Testing8",
"received": "2021-09-12T18:31:45+02:00",
"isDeleted": 0,
"mailboxId": 1,
"id": 17
}
]

## Get email labels of a mailbox

### Request

`GET /mailboxes/id/labels`

    curl -i -H 'Accept: application/json' http://localhost:3000/mailboxes/1/labels

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 1,
        "mailAddress": "thoba@sample1.com",
        "labels": [
            {
            "id": 1,
            "label": "Casual",
            "mailboxId": 1
            },
            {
            "id": 2,
            "label": "Task",
            "mailboxId": 1
            }
        ]
    }

## Send an email message

### Request

`POST /mailboxes/id/messages/`

    curl -i -H 'Accept: application/json' -d '{ "from": "thoba@sample2.com",
    "to": "thoba@sample1.com", "subject": "Test8", "message": "Testing8" }' http://localhost:3000/mailbox/1/messages

### Response

    HTTP/1.1 201 Created
    Content-Type: application/json

    {
        "from": "thoba@sample2.com",
        "subject": "Test8",
        "body": "Testing8",
        "received": "2021-09-12T18:31:45+02:00",
        "isDeleted": 0,
        "mailboxId": 1,
        "id": 9
    }

## Delete an email message

### Request

`PUT /mailboxes/id/messages/delete/messageid`

    curl -i -H 'Accept: application/json'  http://localhost:3000/mailboxes/1/messages/delete/1

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "from": "thoba@sample2.com",
        "subject": "Test8",
        "body": "Testing8",
        "received": "2021-09-12T18:31:45+02:00",
        "isDeleted": 1,
        "mailboxId": 1,
        "id": 9
    }

## Recover a deleted email message

### Request

`PUT /mailboxes/id/messages/recover/messageid`

    curl -i -H 'Accept: application/json'  http://localhost:3000/mailboxes/1/messages/recover/1

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "from": "thoba@sample2.com",
        "subject": "Test8",
        "body": "Testing8",
        "received": "2021-09-12T18:31:45+02:00",
        "isDeleted": 0,
        "mailboxId": 1,
        "id": 9
    }

## Remove a label from an email message

### Request

`PUT /mailboxes/:id/messages/removelabel/:messageid`

    curl -i -H 'Accept: application/json' -d '{ "messageid": 9, "id": 1 }'  http://localhost:3000/mailboxes/1/messages/removelabel/1

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "from": "thoba@sample2.com",
        "subject": "Test8",
        "body": "Testing8",
        "received": "2021-09-12T18:31:45+02:00",
        "isDeleted": 1,
        "mailboxId": 1,
        "id": 9,
        "labelId": null
    }

## Add a label to an email message

### Request

`PUT /mailboxes/:id/messages/setlabel/:messageid`

    curl -i -H 'Accept: application/json' -d '{ "messageid": 9, "labelid": 2, "id": 1 }' http://localhost:3000/mailboxes/1/messages/setlabel/1

### Response

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "from": "thoba@sample2.com",
        "subject": "Test8",
        "body": "Testing8",
        "received": "2021-09-12T18:31:45+02:00",
        "isDeleted": 1,
        "mailboxId": 1,
        "id": 9,
        "labelId": 1
    }
