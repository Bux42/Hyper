module.exports = class CommentManager {
    getCommentsByImdbId(imdb_id, db) {
        return new Promise(resolve => {
            const collection = db.collection('comments');

            var mysort = { date: -1 };

            collection.find({
                imdb_id: imdb_id
            })
            .sort(mysort)
            .toArray(function (err, docs) {
                resolve(docs);
            });
        });
    }
    postComment(comment, imdb_id, user_id, db) {
        return new Promise(resolve => {
            const collection = db.collection('comments');
            var newComment = {
                date: Date.now(),
                user_id: user_id,
                comment: comment,
                imdb_id: imdb_id
            };
            collection.insertOne(newComment);
            resolve(newComment);
        });
    }
}