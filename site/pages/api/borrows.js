import nextConnect from 'next-connect';
import middleware from '../../middleware/mongodb';

const handler = nextConnect();
handler.use(middleware);
handler.get(async (req, res) => {
    let doc = await req.db.collection('borrow_requests').findOne()
    console.log(doc);
    res.json(doc);
});

export default handler;