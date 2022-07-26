const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

async function getAllBooks(req,res){
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // fetch the posts
    let posts = await db
        .collection('book_requests')
        .find({})
        .sort({ createdAt: -1 })
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

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getAllBooks(req, res);
        }

//        case 'POST': {
//            return addRequest(req, res);
//        }
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