import { ObjectId } from 'mongodb';
import uuid4 from 'uuid';
import { mkdir, writeFiles } from 'fs';
import dbClient from '../utils/db';

class FilesController {
    static async postUpload(req, res) {
        const userID = req.headers('X-token') || null;
        if (!userID) return res.status(401).send({ error: 'Unauthorized' });
        const user = await dbClient.users.findOne({ _id: ObjectId(userID) });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });

        const fname = req.body.name;
        if (!fname) return res.status(400).send({ error: 'Missing name' });
        const ftype = req.body.type;
        const accceptTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!ftype || !accceptTypes.includes(ftype)) return res.status(400).send({ error: 'Invalid file type' });

        const fdata = req.body.data;
        if (!fdata && ftype !== 'folder') return res.status(400).send({ error: 'Missing data' });

        let fparentId = req.body.parentId;
        if (fparentId) {
            const parent = await dbClient.files.findOne({ _id: ObjectId(fparentId) });
            if (!parent) return res.status(400).send({ error: 'Parent not found' });
            if (parent.type !== 'folder') return res.status(400).send({ error: 'Parent is not a folder' });
        } else {
            fparentId = 0;
        }
        const fisPublic = req.body.isPublic || false;

        const finsert = {
            userId: user._id,
            name: fname,
            type: ftype,
            parentId: fparentId,
            isPublic: fisPublic,
        };
        if (ftype === 'folder') {
            await dbClient.files.insertOne(finsert);
            const returned = {
                id: finsert._id,
                name: finsert.name,
                userId: finsert.userId,
                type: finsert.type,
                parentId: finsert.parentId,
                isPublic: finsert.isPublic,
            };
            return res.status(201).send(returned);
        }
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        const flname = uuid4();
        const filePath = `${folderPath}/${flname}`;
        const fldata = Buffer.from(fdata, 'base-64');

        mkdir(folderPath, { recursive: true }, (err) => {
            if (error) return res.status(400).send(err.message);
            return true;
        });

        writeFiles(filePath, fldata, (err) => {
            if (err) return res.status(400).send(err.message);
            return true;
        }
        );
        finsert.localpath = path;
        await dbClient.files.insertOne(finsert);
        const returned2 = {
            id: finsert._id,
            userId: finsert.userId,
            name: finsert.name,
            type: finsert.type,
            isPublic: finsert.isPublic,
            parentId: finsert.parentId,
        };
        return res.status(201).send(returned2) 
    }
}

export default FilesController;
