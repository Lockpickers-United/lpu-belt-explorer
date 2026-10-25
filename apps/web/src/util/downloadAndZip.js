import { downloadZip } from 'client-zip'

export default async function downloadAndZip(fileData) {

    if (!Array.isArray(fileData) || !fileData.length) {
        console.error('No files to download',)
        return
    }
    const archiveName = fileData[0].dirname
    try {

        const filePromises = fileData.map(async (file) => {
            const response = await fetch(file.url)
            if (!response.ok) throw new Error(`Failed to fetch file: ${file.name}`)
            return {
                name: file.name,
                input: response
            }
        })

        const filesToZip = await Promise.all(filePromises)
        const blob = await downloadZip(filesToZip).blob()

        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${archiveName}.zip`
        link.click()

        URL.revokeObjectURL(link.href)
        return true
    } catch (error) {
        console.error('Error from ZIP download:', error)
        return false
    }
}
