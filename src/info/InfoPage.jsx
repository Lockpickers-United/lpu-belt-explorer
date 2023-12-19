import React, {useCallback} from 'react'
import ReactMarkdown from 'react-markdown'
import introMd from '../resources/intro.md?raw'
import infoMd from '../resources/info.md?raw'
import changelogMd from '../resources/changelog.md?raw'

function InfoPage() {

    const updateTime = '12/4/2023'

    return (
        <React.Fragment>


            <div style={{
                maxWidth: 700, padding: '8px 8px 16px 8px', backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto'
            }}>

                <div style={{width: '95%', marginLeft: 'auto', marginRight: 'auto'}}>

                    <ReactMarkdown linkTarget="_blank">
                        {markdown}
                    </ReactMarkdown>
                </div>
            </div>

            <div style={{
                padding: '8px 12px 24px 8px', fontSize: '0.8rem', textAlign: 'right', color: '#ccc',
                maxWidth: 700, backgroundColor: '#111', marginLeft: 'auto', marginRight: 'auto'
            }}>

                Updated: {updateTime}
            </div>

        </React.Fragment>

    )
}

const markdown = [
    introMd,
    infoMd,
    changelogMd
].join('\n\n---\n\n')

export default InfoPage
