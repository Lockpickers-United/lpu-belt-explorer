import Joi from 'joi'

export const mainSchema = Joi.array().items(
    Joi.object({
        Belt: Joi.string()
            .valid(
                'White',
                'Yellow',
                'Orange',
                'Green',
                'Blue',
                'Purple',
                'Brown',
                'Red',
                'Black 1',
                'Black 2',
                'Black 3',
                'Black 4',
                'Black 5',
                'Unranked'
            ),
        Make: Joi.string().allow(''),
        Model: Joi.string().min(1),
        Version: Joi.string().allow(''),
        'Locking Mechanisms': Joi.string().allow(''),
        Features: Joi.string().allow(''),
        Notes: Joi.string().allow(''),
        'Unique ID': Joi.string().regex(/^[0-9a-f]{8}$/)
    }).unknown()
)

export const mediaSchema = Joi.array().items(
    Joi.object({
        'Unique ID': Joi.string().regex(/^[0-9a-f]{8}$/),
        'Sequence ID': Joi.number().min(1).max(50),
        Title: Joi.string().min(1),
        Subtitle: Joi.string().allow(''),
        'Thumbnail URL': Joi.string(),
        'Full URL': Joi.string().allow('').uri(),
        'Subtitle URL': Joi.string().allow('').uri(),
        'Full Image Direct URL': Joi.string().allow('').uri()
    }).unknown()
)

export const linkSchema = Joi.array().items(
    Joi.object({
        'Unique ID': Joi.string().regex(/^[0-9a-f]{8}$/),
        'Sequence ID': Joi.number().min(1).max(50),
        Title: Joi.string().min(1),
        URL: Joi.string().uri()
    }).unknown()
)

export const viewSchema = Joi.array().items(
    Joi.object({
        'Unique ID': Joi.string().regex(/^[0-9a-f]{8}$/),
        'Count': Joi.number().min(0)
    }).unknown()
)

export const groupSchema = Joi.array().items(
    Joi.object({
        'Unique ID': Joi.string().regex(/^[0-9a-f]{8}$/),
        'Related IDs': Joi.string().min(1)
    }).unknown()
)

export const glossarySchema = Joi.array().items(
    Joi.object({
        Term: Joi.string(),
        Definition: Joi.string(),
        Title: Joi.string().allow(''),
        Subtitle: Joi.string().allow(''),
        'Thumbnail URL': Joi.string().allow(''),
        'Full URL': Joi.string().allow('').uri(),
        'Subtitle URL': Joi.string().allow('').uri(),
        'Full Image Direct URL': Joi.string().allow('').uri()
    }).unknown()
)

export const dialsSchema = Joi.array().items(
    Joi.object({
        'Unique ID': Joi.string().regex(/^[0-9a-f]{8}$/).allow(''),
        Make: Joi.string().allow(''),
        Model: Joi.string().allow(''),
        'UL Group': Joi.string().allow(''),
        'Fence Type': Joi.string().allow(''),
        Wheels: Joi.string().allow(''),
        Digits: Joi.string().allow(''),
        Features: Joi.string().allow('')
    }).unknown()
)
