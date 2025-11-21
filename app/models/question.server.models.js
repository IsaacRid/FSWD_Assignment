const db = require('../../database');

const ask_question = (questionData, done) => {
    const sql = `INSERT INTO questions (question_id, question_text, answer)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    let values = [
        questionData.question_id,
        questionData.question_text,
        null
    ];
    db.run(sql, values, function (err) {
        if (err) {
            return done(err);
        }
        done(null);
    });
}

const get_questions = (itemId, done) => {
    const sql = `SELECT * FROM questions WHERE item_id = ?`;
    let results = [];
    db.each(sql, [itemId], (err, row) => {
        if (err) return done(err, null);
        results.push(row);
    }, (err, count) => {
        if (err) return done(err, null);
        done(null, results);
    });
};

const answer_question = (questionId, answerText, done) => {
    const sql = `UPDATE questions SET answer = ? WHERE question_id = ?`;
    let values = [answerText, questionId];
    db.run(sql, values, function (err) {
        if (err) {
            return done(err);
        }
        done(null);
    });
}

module.exports = {
    ask_question,
    get_questions,
    answer_question
};