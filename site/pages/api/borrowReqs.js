const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getBorrowRequests(req, res);
        }

//        case 'POST': {
//            return addBorrowRequest(req, res);
//        }
//
//        case 'PUT': {
//            return updateBorrowRequest(req, res);
//        }
//
//        case 'DELETE': {
//            return deleteBorrowRequest(req, res);
//        }
    }
}

async function getBorrowRequests(req,res) {
    try {
        // Connect to the database
        let { db } = await connectToDatabase();

        // fetch the data
        let requests = await db
            .collection("borrow_requests")
            .find({})
            .sort({ published: -1 })
            .toArray();

        return res.json({
            data: JSON.parse(JSON.stringify(requests)),
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            error: new Error(error).message,
            success: false,
        });
    }
}
