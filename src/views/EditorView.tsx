import styled from 'styled-components'

import FileEditorPanel from '@/components/editor/FileEditorPanel'
import FileExplorerPanel from '@/components/editor/FileExplorerPanel'

const Page = styled.div`
  display: grid;
  grid-template-columns: 400px auto;
  height: 100%;
`

const EditorView = () => {
  return (
    <Page>
      <FileExplorerPanel />
      <FileEditorPanel />
    </Page>
  )
}

export default EditorView