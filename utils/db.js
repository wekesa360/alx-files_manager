const { MongoClient } = require('mongodb');

const host = process.env.BD_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manage';
const url = `mondodb://${host}:${port}/${database}`;
class DBClient {
    constructor() {
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                this.db = false;
            } else {
                this.db = client.db(database);
            }
        });
    }
    isAlive() {
        if (this.db) {
            return true;
        }
        return false;
}
    async nbUsers() {
        this.db.collection('users').countDocuments();
}
    async nbFiles() {
        this.db.collection('files').countDocuments();
}
}

const dbClient = new DbClient();
export default dbClient;