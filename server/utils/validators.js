const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")

const signupValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required().trim().label("Name"),
        email: Joi.string().email().required().trim().label("Email"),
        password: passwordComplexity().min(8).max(14).required().trim().label("Password"),
        photo: Joi.string().allow("").label("photo"),
    })

    return schema.validate(data)
}

const courseValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).required().trim().label("Name"),
        photo: Joi.string().allow("").label("photo"),
        description: Joi.string().min(2).required().trim().label("Description"),
        category: Joi.string().required().label("Category"),
        summary: Joi.string().required().max(60).label("summary"),
        type: Joi.string().required().label("Type"),
        price: Joi.number().label("Price"),
    })

    return schema.validate(data)
}

const courseUpdateValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().allow("").min(2).trim().label("Name"),
        photo: Joi.string().allow("").label("photo"),
        summary: Joi.string().max(60).label("summary"),
        category: Joi.string().label("Category"),
        description: Joi.string().min(2).trim().label("Description"),
        learningOutcomes: Joi.string().label("learning Outcomes"),
        lessons: Joi.string().label("Lessons"),
        published: Joi.boolean().label("Published"),
        type: Joi.string().label("Type"),
        price: Joi.number().label("Price"),
    })

    return schema.validate(data)
}

const addLessonValidator = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).trim().required().label("Title"),
        content: Joi.string().min(3).trim().required().label("Content"),
        resource_url: Joi.string().allow("").trim().label("Resource Url"),
    })

    return schema.validate(data)
}

module.exports = {
    signupValidator,
    courseValidator,
    courseUpdateValidator,
    addLessonValidator,
}
