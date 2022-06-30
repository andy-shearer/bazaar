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
        .sort({ published: -1 })
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
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // add the post
        await db.collection('borrow_requests').insertOne(JSON.parse(req.body));
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
