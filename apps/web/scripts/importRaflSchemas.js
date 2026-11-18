import Joi from 'joi'

export const raflSchema = Joi.array().items(
    Joi.object({
        'Unique ID': Joi.string().regex(/\d{4}-\d{3}$/),
        'Year': Joi.number(),
        'Pot Number': Joi.number().max(999),
        'Contributed By': Joi.string(),
        'Title': Joi.string(),
        'Winner Count': Joi.number().allow(''),
        'Display Name': Joi.string().allow(''),
        'Description': Joi.string().allow(''),
        'Description Continued': Joi.string().allow(''),
        'Pot Contents': Joi.string().allow(''),
        'Tags': Joi.string().allow(''),
        'Category': Joi.string().allow(''),
        'Keywords': Joi.string().allow(''),
        'Country': Joi.string().allow(''),
        'Shipping Info Text': Joi.string().allow(''),
        'Split Shipping': Joi.string().allow(''),
        'Shipping Type': Joi.string().allow(''),
        'Ships To US': Joi.string().allow(''),
        'Date Added': Joi.string().allow('')
    }).unknown()
)

export const raflMediaSchema = Joi.array().items(
    Joi.object({
        'Unique ID': Joi.string().regex(/\d{4}-\d{3}$/),
        'Sequence ID': Joi.number().min(1).max(50),
        Title: Joi.string().min(1),
        Subtitle: Joi.string().allow(''),
        'Thumbnail URL': Joi.string(),
        'Full URL': Joi.string().allow('').uri(),
        'Subtitle URL': Joi.string().allow('').uri(),
        'Full Image Direct URL': Joi.string().allow('').uri()
    }).unknown()
)

export const raflCharitySchema = Joi.array().items(
    Joi.object({
        'Charity ID': Joi.string(),
        'Charity Name': Joi.string(),
        'Disable': Joi.string().allow(''),
        'URL': Joi.string().allow('').uri(),
        'Tags': Joi.string().allow(''),
        'Donations 2024': Joi.string().allow(''),
        'Donations 2025': Joi.string().allow('')
    }).unknown()
)
