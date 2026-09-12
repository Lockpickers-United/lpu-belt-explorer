import exportCollection from './exportCollectionHandler.js'


try {
    await exportCollection({collection: 'awards', devDb: false})
        .then(results => { console.log('exported', results.metadata.collection, '-', results.data.length, 'records') })

    await exportCollection({collection: 'evidence', devDb: false})
        .then(results => { console.log('exported', results.metadata.collection, '-', results.data.length, 'records') })

} catch (error) {
    console.error('Error exporting collection:', error)
}
