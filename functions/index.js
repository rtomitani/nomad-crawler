const functions = require('firebase-functions');
const admin = require('firebase-admin')
const adminApp = admin.initializeApp();
const db = adminApp.firestore();

const got = require('got');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const crawlers = {
    getHafhProperties: require('./crawlers/getHafhProperties')
};

exports.doJob = functions.pubsub.schedule('every 1 mins').timeZone('Asia/Tokyo').onRun(async (context) => {
    const snapshot = await db.collection('jobs').orderBy('createdAt', 'asc').limit(1).get();

    snapshot.forEach((doc) => {
        const crawler = doc.get('crawler');

        console.log(doc.data());
        if(crawler) {
            crawlers[crawler](db, doc.get('parameters'));
        }
        doc.ref.delete();
    });
});

exports.getAllHafhProperties = functions.pubsub.schedule('every saturday 09:00').timeZone('Asia/Tokyo').onRun((context) => {
    const start = 1, end = 1050, max = 5;
    const batch = db.batch();

    for(let i = start; i <= end; i += max) {
        batch.create(db.collection('jobs').doc(), {
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            crawler: 'getHafhProperties',
            parameters: {
                start: i,
                end: Math.min(i + max - 1, end)
            }
        });
    }

    return batch.commit();
});