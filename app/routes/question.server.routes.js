const questions = require('../controllers/question.server.controllers.js');
const authorise = require('../lib/authentication.js');

module.exports = function (app) {
    app.route('/item/:itemId/question')
        .post(authorise, questions.ask_question)
        .get(questions.get_questions)
    app.route('/question/:questionId')
        .post(authorise, questions.answer_question)
}