import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./components/CodeEditor";
import CodeViewer from "./components/CodeViewer";
import LeftNavigation from "./components/LeftNavigation";
import { useEffect, useMemo, useState } from "react";
import { WindowManager } from "@/types/editor";
import { cn } from "./lib/utils";
import NodeExplorer from "./components/NodeExplorer";
import AttributesPanel from "./components/twClassPanel/AttributesPanel";
import VersionControlPanel from "./components/VersionControlPanel";
import BaseLayout from "./components/layout/Base";
import RightNavigation from "./components/RightNavigation";
import { useEditorManager } from "./hooks/useEditorManager";
import useCheckScreenDimensions from "./hooks/useCheckScreenDimensions";
import OrientationError from "./components/layout/OrientationError";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { CodeXml } from "lucide-react";

function App() {
  const projectName = useEditorManager((state) => state.project?.name);
  const resetProject = useEditorManager((state) => state.resetProject);

  const [tabManager, setTabManager] = useState<WindowManager>({
    left: {
      explorer: true,
      versionControl: false,
    },
    right: {
      attributes: true,
    },
    center: {
      viewer: true,
      monacoEditor: true,
    },
  });

  const isLeftSideActive = useMemo(() => {
    return Object.values(tabManager.left).filter((v) => v).length === 0;
  }, [tabManager.left]);

  const isRightSideActive = useMemo(() => {
    return Object.values(tabManager.right).filter((v) => v).length === 0;
  }, [tabManager.right]);

  const isIncorrectScreen = useCheckScreenDimensions();

  useEffect(() => {
    return () => {
      resetProject();
    };
  }, [resetProject]);

  if (isIncorrectScreen) {
    return <OrientationError />;
  }

  return (
    <BaseLayout
      className="flex"
      projectName={projectName}
      toolbar={
        <>
          <div className="mr-10 flex items-center space-x-2">
            <CodeXml className="h-5 w-5 text-white" />
            <Switch
              id="devModeSwitch"
              aria-label="Show code Switch"
              checked={tabManager.center.monacoEditor}
              onCheckedChange={(checked) => {
                setTabManager((prev) => ({
                  ...prev,
                  center: {
                    ...prev.center,
                    monacoEditor: checked,
                  },
                }));
              }}
            />
          </div>
          <RightNavigation
            openTabs={tabManager.right}
            setOpenTabs={setTabManager}
          />
        </>
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

        <Panel
          className={cn({
            hidden: !tabManager.center.monacoEditor,
          })}
          minSize={30}
        >
          <CodeEditor />
        </Panel>
        <PanelResizeHandle
          className={cn("ResizeHandle", {
            hidden: !tabManager.center.monacoEditor,
          })}
        />

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
