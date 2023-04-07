import fbxJson from "./fbx.json";
import { traverseFbxNode } from "./src/traverseFbxNode";

const found = traverseFbxNode(fbxJson, (n, keys) => {
  //   console.log(n.name, keys, n.props);

  if (n.props?.[0] === "pm_pose_info") {
    // console.log(n.name, keys);
    // console.log(n.props);
    // console.log(n.props[4]);
    // console.log(JSON.parse(n.props[4]));
    return n.props as string[];
  }
});
console.log({ found });
console.log(fbxJson[8].nodes[80].nodes[1].nodes[7].props[4]);
