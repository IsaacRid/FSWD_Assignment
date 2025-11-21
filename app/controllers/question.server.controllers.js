const Joi = require('joi');
const question = require('../models/question.server.models');

const ask_question = (req, res) => {
    const addQuestionSchema = Joi.object({
        question_text: Joi.string().required()
    });

    const { error } = addQuestionSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let questionData = Object.assign({}, req.body);

    question.ask_question(questionData, (err) => {
        if (err) {
            return res.status(500);
        }

        res.status(200);
    });
}

const get_questions = (req, res) => {
    question.get_questions(req.params.itemId, (err, questions) => {
        if (err) {
            return res.status(500);
        }
        res.status(200).json(questions);
    });
}

const answer_question = (req, res) => {
    const questionAnswerSchema = Joi.object({
        answer_text: Joi.string().required()
    });

    const { error } = questionAnswerSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    question.answer_question(req.params.questionId, req.body.answer_text, (err) => {
        if (err) {
            return res.sendStatus(500)
        }
        res.sendStatus(200);
    });
}

module.exports = {
    ask_question,
    get_questions,
    answer_question
};