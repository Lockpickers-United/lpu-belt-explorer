import React, {useContext, useMemo} from 'react'
import BeltStripe from '../entries/BeltStripe'
import useWindowSize from '../util/useWindowSize.jsx'
import entryName from '../entries/entryName'
import ClassificationContext from '../app/ClassificationContext.jsx'

function ChangelogEntry({entry}) {
    const style = {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto'}
    const lockName = entryName(entry, 'short', {includeVersion: true})
    const {
        getAdminAction,
    } = useContext(ClassificationContext)

    const adminAction = getAdminAction(entry)

    const makeModels = useMemo(() => {
        return (
            <div style={{fontWeight: 500, fontSize: '1.07rem', lineHeight: 1.5, marginBottom: '4px'}}>
                {entry.makeModels?.map(({make, model}, index) =>
                    <span key={index}>{make && make !== model ? `${make} ${model}` : model}<br/></span>
                )}
            </div>
        )
    }, [entry.makeModels])

    const {isMobile} = useWindowSize()
    const makeModelWidth = !isMobile ? '65%' : '60%'

    return (
        <div style={style} aria-label={lockName}>
            <div style={{alignItems: 'center', position: 'relative', paddingLeft: 12, marginTop: 16}}>
                <BeltStripe value={adminAction.updatedBelt || entry.belt}/>
                <div style={{
                    margin: '8px 16px',
                    width: makeModelWidth,
                    paddingRight: 4,
                    flexShrink: 0,
                    flexDirection: 'column'
                }}>
                    <div>{makeModels}</div>

                    {!!entry.version &&
                        <div style={{marginTop: 5}}>
                            <div style={{
                                fontSize: '0.95rem',
                                lineHeight: 1.25,
                                marginTop: 2,
                                marginLeft: 8
                            }}>{entry.version}</div>
                        </div>
                    }
                </div>
                <div style={{margin: '8px 16px', fontSize: '1.0rem'}}>
                    {adminAction.note}
                </div>
            </div>

        </div>
    )
}

export default React.memo(ChangelogEntry)
