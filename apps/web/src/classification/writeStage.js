const stageOrder = {read: 0, vote: 1, action: 2, publish: 3}
const configuredStage = import.meta.env.VITE_CLASSIFICATION_WRITE_STAGE ??
    (import.meta.env.MODE === 'test' ? 'publish' : 'read')
const activeStage = stageOrder[configuredStage] ?? stageOrder.read

export const canWriteVotes = activeStage >= stageOrder.vote
export const canWriteActions = activeStage >= stageOrder.action
export const canPublishClassification = activeStage >= stageOrder.publish
