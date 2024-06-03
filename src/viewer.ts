function onLoad() {
  const pre = getPreWithCode();
  console.log(pre);
}

function getPreWithCode(): HTMLPreElement | null {
  const childNodes = document.body.childNodes;

  if (childNodes.length === 0) {
    return null;
  }

  if (childNodes.length > 1 && allTextNodes(childNodes)) {
    document.body.normalize(); // concatenates adjacent text nodes
  }

  const childNode = childNodes[0];
  const nodeName = childNode.nodeName;

  if (nodeName === "PRE") {
    return childNode as HTMLPreElement;
  }

  const textContent = childNode.textContent ?? "";
  if (nodeName === "#text" && textContent.trim().length > 0) {
    const pre = document.createElement("pre");
    pre.textContent = textContent;
    document.body.removeChild(childNode);
    document.body.appendChild(pre);
    return pre;
  }

  return null;
}

function allTextNodes(nodes: NodeListOf<ChildNode>): boolean {
  return !Array.from(nodes).some((node) => node.nodeName !== "#text");
}

document.addEventListener("DOMContentLoaded", onLoad, false);
