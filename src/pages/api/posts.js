import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('threads');

    if (req.method === 'POST') {
        const { image, caption, username } = req.body;

        const createdAt = new Date().toISOString(); 

        await db.collection('posts').insertOne({ image, caption, username, createdAt });

        res.status(201).json({ message: 'Post created' });


    } else if (req.method === 'GET') {
      const posts = await db.collection('posts').find().toArray();

      res.status(200).json(posts);

    } else if (req.method === 'DELETE') {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Id is required' });
        }

        const result = await db.collection('posts').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: 'Post deleted' });
        } else {
            return res.status(404).json({ message: 'Post not found' });
        }
    }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    } finally {
        client.close();
    }
}
