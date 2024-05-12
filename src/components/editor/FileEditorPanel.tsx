import styled from 'styled-components'

import Graph from '@/components/graph/Graph'

const Panel = styled.div`
  display: flex;
  flex-flow: column;
`

const EditorArea = styled.div`
  flex-grow: 1;
`

const FileEditorPanel = () => {
  return (
    <Panel>
      <div>Tabs</div>

      <EditorArea>
        <Graph/>
      </EditorArea>
    </Panel>
  )
}

export default FileEditorPanel