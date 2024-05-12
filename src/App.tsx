import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import LeftNavigation from "./components/LeftNavigation";
import { useMemo, useState } from "react";
import { WindowManager } from "@/types/editor";
import { cn } from "./lib/utils";
import NodeExplorer from "./components/NodeExplorer";
import AttributesPanel from "./components/twClassPanel/AttributesPanel";
import VersionControlPanel from "./components/VersionControlPanel";
import BaseLayout from "./components/layout/Base";
import RightNavigation from "./components/RightNavigation";
import { useEditorManager } from "./hooks/useEditorManager";

function App() {
  const projectName = useEditorManager((state) => state.project?.name);

  const [tabManager, setTabManager] = useState<WindowManager>({
    left: {
      explorer: true,
      versionControl: false,
    },
    right: {
      attributes: true,
    },
  });

  const isLeftSideActive = useMemo(() => {
    return Object.values(tabManager.left).filter((v) => v).length === 0;
  }, [tabManager.left]);

  const isRightSideActive = useMemo(() => {
    return Object.values(tabManager.right).filter((v) => v).length === 0;
  }, [tabManager.right]);

  return (
    <BaseLayout
      className="flex"
      projectName={projectName}
      toolbar={
        <RightNavigation
          openTabs={tabManager.right}
          setOpenTabs={setTabManager}
        />
      }
    >
      <LeftNavigation openTabs={tabManager.left} setOpenTabs={setTabManager} />
      <PanelGroup direction="horizontal" className="bg-editor-black">
        <Panel
          className={cn({
            hidden: isLeftSideActive,
          })}
          defaultSize={15}
          minSize={10}
          maxSize={15}
        >
          <NodeExplorer
            className={cn({
              hidden: !tabManager.left.explorer,
            })}
          />
          <VersionControlPanel
            className={cn({
              hidden: !tabManager.left.versionControl,
            })}
          />
        </Panel>
        <PanelResizeHandle
          className={cn("ResizeHandle", {
            hidden: isLeftSideActive,
          })}
        />

        <Panel minSize={30}>
          <CodeEditor />
        </Panel>
        <PanelResizeHandle className="ResizeHandle" />

        <Panel minSize={30}>
          <CodeViewer />
        </Panel>

        <PanelResizeHandle
          className={cn("ResizeHandle", {
            hidden: isRightSideActive,
          })}
        />
        <Panel
          defaultSize={16}
          minSize={16}
          maxSize={20}
          className={cn("bg-editor-gray-dark", {
            hidden: isRightSideActive,
          })}
        >
          <AttributesPanel
            className={cn({
              hidden: !tabManager.right.attributes,
            })}
          />
        </Panel>
      </PanelGroup>
    </BaseLayout>
  );
}

export default App;
