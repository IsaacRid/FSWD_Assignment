const questions = require('../controllers/question.server.controllers.js');

module.exports = function (app) {
    app.route('/item/:itemId/question')
        .post(questions.ask_question)
        .get(questions.get_questions)
    app.route('/question/:questionId')
        .post(questions.answer_question)
}