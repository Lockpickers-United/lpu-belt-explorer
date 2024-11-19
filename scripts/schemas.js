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
        Features: Joi.string().allow(''),
        Notes: Joi.string().allow(''),
        'Quest Tier': Joi.string().allow(''),
        'Do Not Import': Joi.string().allow('')
    }).unknown()
)

export const danSchema = Joi.object({
    Lock: Joi.string().min(1),
    Link: Joi.string().min(1),
    'Unique LPU id': Joi.number().integer(),
    'Duplicate/Sameline checker': Joi.number().integer(),
    'Lock Points': Joi.number().integer(),
    Modifier: Joi.string()
        .valid(
            'N/A', 
            'First Recorded Pick', 
            'First Recorded Pick (Notable)',
            'Non-Picking Defeat',
            'First Recorded Defeat',
            'First Recorded Defeat (Notable)',
            'Other',
            'Upgraded'
        ),
    'Lock * Modifier Points': Joi.number()
}).unknown()

export const projectSchema = Joi.array().items(
    Joi.object({
        Name: Joi.string().min(1),
        Tier: Joi.string().valid('T1', 'T2', 'T3', 'T4', 'T5'),
        'Unique ID': Joi.string().regex(/^[0-9a-f]{8}$/).allow('')
    }).unknown()
)

export const introCopySchema = Joi.array().items(
    Joi.object({
        Page: Joi.string().min(1),
        Title: Joi.string().min(1),
        'Intro Copy': Joi.string().min(1),
        'Link Text': Joi.string().allow(''),
        'Link Destination': Joi.string().allow('')
    }).unknown()
)

export const upgradeSchema = Joi.array().items(
    Joi.object({
        'Base ID': Joi.string().regex(/^[0-9a-f]{8}$/).allow(''),
        'Upgrade ID 1': Joi.string().regex(/^[0-9a-f]{8}$/).allow(''),
        'Upgrade ID 2': Joi.string().regex(/^[0-9a-f]{8}$/).allow(''),
        'Upgrade ID 3': Joi.string().regex(/^[0-9a-f]{8}$/).allow(''),
        'Upgrade ID 4': Joi.string().regex(/^[0-9a-f]{8}$/).allow('')
    }).unknown()
)

export const raflSchema = Joi.array().items(
    Joi.object({
        'Unique ID': Joi.string().regex(/^[0-9a-f]{8}$/),
        'Year': Joi.number().allow('2024'),
        'Pot Number': Joi.number().min(1).max(999),
        'Title': Joi.string().min(1).max(100),
        'Description': Joi.string().min(1),
        'Contributed By': Joi.string().min(1),
        'Tags': Joi.string().allow(''),
        'Country': Joi.string(),
        'Shipping Info': Joi.string(),
        'Winner': Joi.string().allow('')
    }).unknown()
)
