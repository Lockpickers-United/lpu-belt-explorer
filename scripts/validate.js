export default (data, schema) => {
    const results = schema.validate(data)
    if (results.error) {
        console.log('Parse error!', JSON.stringify(results.error.details, null, 2))
        process.exit(1)
    }
}