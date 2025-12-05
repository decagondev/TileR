import { Sidebar } from "@/components/layout/Sidebar"
import { Main } from "@/components/layout/Main"
import { Panel } from "@/components/layout/Panel"

function App() {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />
      <Main />
      <Panel />
    </div>
  )
}

export default App