import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import React, {useContext} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import markdown from '../resources/scorcardInfoFaqBB.md?raw'
import '../resources/md-tables.css'
import AuthContext from '../app/AuthContext.jsx'

function InfoFaqBB() {

    const {user} = useContext(AuthContext)
    const idText = user
        ? user.uid
        : '(your id)'
    const markdownParsed = String(markdown).replace('[YourID]', idText)

    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 760,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginBottom: 16
            }}>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]} remarkPlugins={[remarkGfm]}>
                        {markdownParsed}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default InfoFaqBB
