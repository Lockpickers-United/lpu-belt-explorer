import axios from 'axios'

export const postData = async ({url, formData, setResponse, setUploadError}) => {

    await axios.post(
        url, formData,
        {headers: {'Content-Type': 'multipart/form-data'}}
    )
        .then(response => {
            setResponse(response.data)
            console.log('response.data', response.data)
        })
        .catch(error => {
            console.error('upload error', error)
            setUploadError(error)
        })

}