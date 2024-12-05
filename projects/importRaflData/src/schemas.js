import Joi from 'joi'

export const raflSchema = Joi.array().items(
    Joi.object({
            'Unique ID': Joi.string().regex(/\d{4}-\d{3}$/),
            'Year': Joi.number().max(2030),
            'Pot Number': Joi.number().max(999),
            'Form ID': Joi.number().allow(''),
            'Title': Joi.string(),
            'Description': Joi.string().allow(''),
            'Pot Contents': Joi.string().allow(''),
            'Contributed By': Joi.string(),
            'Tags': Joi.string().allow(''),
            'Country': Joi.string().allow(''),
            'Shipping Info Text': Joi.string().allow(''),
            'Split Shipping': Joi.string().allow(''),
            'Shipping Type': Joi.string().allow(''),
            'Winner': Joi.string().allow('')
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
            'Charity Name': Joi.string(),
            'URL': Joi.string().allow('').uri(),
            'Total Donations 2024': Joi.string().allow(''),
    }).unknown()
)


export const raflPotStatsSchema = Joi.array().items(
    Joi.object({
        'Unique ID': Joi.string().regex(/\d{4}-\d{3}$/),
        'Pot Number': Joi.number(),
        'Pot Name': Joi.string(),
        'Tickets': Joi.string().allow(''),
        'Donors': Joi.string().allow('')
    }).unknown()
)

export const raflCharityStatsSchema = Joi.array().items(
    Joi.object({
        'Charity Name': Joi.string(),
        'Total Donations 2025': Joi.string().allow('')
    }).unknown()
)

export const raflSummaryStatsSchema = Joi.array().items(
    Joi.object({
        'Donors': Joi.string(),
        'Donation Total': Joi.number(),
        'From Reddit': Joi.string(),
        'From Discord': Joi.string(),
        '2024 Raffle Total': Joi.string(),
    }).unknown()
)
