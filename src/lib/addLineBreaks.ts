export function addLineBreaks(
  htmlString: string,
  wordsPerLine: number = 10
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

  const nodesToProcess: { node: Text; parent: Node }[] = [];

  // First, collect all text nodes and their parents
  let currentText = walker.nextNode();
  while (currentText !== null) {
    if (currentText.parentNode !== null) {
      nodesToProcess.push({
        node: currentText as Text,
        parent: currentText.parentNode,
      });
    }
    currentText = walker.nextNode();
  }

  // Process each text node to insert <br> elements
  nodesToProcess.forEach(({ node, parent }) => {
    const words = node.textContent!.trim().split(/\s+/);
    if (words.length > wordsPerLine) {
      const tempSpan = document.createElement("span");
      words.forEach((word, index) => {
        tempSpan.appendChild(document.createTextNode(`${word} `));
        if ((index + 1) % wordsPerLine === 0 && index + 1 < words.length) {
          tempSpan.appendChild(document.createElement("br"));
        }
      });
      // Insert the new content and remove the original node
      parent.insertBefore(tempSpan, node);
      parent.removeChild(node);
    }
  });

  return doc.body.innerHTML;
}
