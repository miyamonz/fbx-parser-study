import { useEffect, useMemo, useState } from "react";
import { ModelInput } from "./ModelInput";
import { FBXReader, parseBinary, parseText } from "fbx-parser";
// import { JsonViewer } from "@textea/json-viewer";
// import { FBX, FBXAxes } from "@picode/fbx";
import { traverseFbxNode } from "./traverseFbxNode";

function parseFBXArrayBuffer(ab: ArrayBuffer) {
  const fbxUint8Array = new Uint8Array(ab);
  return parseBinary(fbxUint8Array);
}

function App() {
  const [ab, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const fbxJson = useMemo(() => {
    if (ab) {
      return parseFBXArrayBuffer(ab);
    }
  }, [ab]);

  const [text, setText] = useState<string | null>(null);
  // console.log("text", text);
  // const fbxJson = useMemo(() => {
  //   if (text) {
  //     return parseText(text);
  //   }
  // }, [text]);

  useEffect(() => {
    if (fbxJson) {
      console.log("fbxJson", fbxJson);
      // const root = new FBXReader(fbxJson);
      // // console.log(root);

      // const str = root
      //   .node("Objects")
      //   ?.node("Model")
      //   ?.node("Properties70")
      //   ?.node("P", { 0: "pm_pose_info" }) // <-
      //   // ?.prop(4, "string");
      const str = traverseFbxNode(fbxJson, (n) => {
        if (n.props?.[0] === "pm_pose_info") {
          const str = n.props[4];
          if (typeof str !== "string")
            throw new Error("props[4] is not string");
          return str;
        }
      });

      console.log(str);
      console.log(str && JSON.parse(str));

      return;
      // const fbx = new FBX(fbxJson);
      // console.log(fbx);
      // // const root = fbx.getModel("Root");
      // console.log("Root", root);
      // console.log(root?.node.fbxNode.nodes[1].nodes);
      // console.log(
      //   root?.node.fbxNode.nodes[1].nodes.find(
      //     (n) => n.props[0] === "pm_pose_info"
      //   )
      // );
    }
  }, [fbxJson]);

  return (
    <div className="App">
      <ModelInput
        ext="fbx"
        onDropArrayBuffer={(ext, ab) => setArrayBuffer(ab)}
        onDropText={(ext, text) => setText(text)}
      />
      {/* {fbxJson && <JsonViewer value={fbxJson} />} */}
      {fbxJson && <pre>{JSON.stringify(fbxJson, null, 4)}</pre>}
    </div>
  );
}

export default App;
