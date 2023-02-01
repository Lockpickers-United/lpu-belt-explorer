import Joi from 'joi'

export default Joi.array().items(
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
                'Black 5'
            ),
        Make: Joi.string().allow(''),
        Model: Joi.string().min(1),
        Version: Joi.string().allow(''),
        'Locking Mechanisms': Joi.string().allow(''),
        Features: Joi.string().allow(''),
        Notes: Joi.string().allow(''),
        Regions: Joi.string().allow(''),
        Links: Joi.string().allow('').regex(/\[([^\]]+)]\(([^)]+)\),?/),
        Media: Joi.string().allow('').regex(/\[([^\]]+)]\(([^)]+)\),?/),
        Attribution: Joi.string().allow('').regex(/\[([^\]]+)]\(([^)]+)\),?/)
    })
)