import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import React, {useContext} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import howToMd from '../resources/danImportHowTo.md?raw'
import '../resources/md-tables.css'
import AuthContext from '../app/AuthContext.jsx'

function DansPage() {
    const updateTime = '8/15/2024'

    const {user} = useContext(AuthContext)
console.log(user)

    const idText = user
        ? user.uid
        : '(your id)'

    const howToMdParsed = howToMd.replace('[YourID]', idText)

    return (
        <React.Fragment>
            <Card style={{
                maxWidth: 760,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 16,
                marginButtom: 16
            }}>
                <CardContent>
                    <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]} remarkPlugins={[remarkGfm]}>
                        {howToMdParsed}
                    </ReactMarkdown>
                </CardContent>
                <CardActions>
                    Updated: {updateTime}
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

export default DansPage
