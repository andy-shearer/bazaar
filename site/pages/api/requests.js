import sanitizeHtml from 'sanitize-html';

const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

async function getRequests(req,res){
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // fetch the posts
    let posts = await db
        .collection('borrow_requests')
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();
    // return the posts
    return res.json({
        message: JSON.parse(JSON.stringify(posts)),
        success: true,
    });
  } catch (error) {
    // return the error
    return res.json({
        message: new Error(error).message,
        success: false,
    });
  }
}

async function addRequest(req, res) {
    // Sanitize the input to protect against XSS
    let body = JSON.parse(req.body);

    body.title = sanitize(body.title);
    body.duration = sanitize(body.duration);
    body.address = sanitize(body.address);
    body.type = sanitize(body.type);

    const collection = body.type === "book" ? "book_requests" : "borrow_requests";
    if(body.type === "book") {
      body.request = true;
    }

    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // add the post
        await db.collection(collection).insertOne(body);
        // return a message
        return res.json({
            message: 'Request added successfully',
            success: true,
        });
    } catch (error) {
        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getRequests(req, res);
        }

        case 'POST': {
            return addRequest(req, res);
        }
//
//            case 'PUT': {
//                return updatePost(req, res);
//            }
//
//            case 'DELETE': {
//                return deletePost(req, res);
//            }
    }
}

function sanitize(dirty) {
  if(dirty) {
    const clean = sanitizeHtml(dirty, {
      allowedTags: [],
      allowedAttributes: {}
    });
//    console.log(`Sanitized ${dirty} into ${clean}`);
    return clean;
  }
}
