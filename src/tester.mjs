export function scanCode(source) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  let quote = "";
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === quote) quote = "";
      continue;
    }
    if (ch === "'" || ch === '"' || ch === "`") {
      quote = ch;
      continue;
    }
    if ("([{".includes(ch)) stack.push(ch);
    else if (pairs[ch] && stack.pop() !== pairs[ch]) return `Unmatched ${ch}`;
  }
  if (quote) return "Unclosed string";
  if (stack.length) return `Unclosed ${stack.at(-1)}`;
  return "";
}

export function verifyProject({ projectName, notes = "", modules = [], files = [] }) {
  const passed = [];
  const flags = [];
  for (const file of files) {
    if (!String(file.source || "").trim()) {
      flags.push(`${file.name} is empty.`);
      continue;
    }
    const problem = file.name.endsWith(".json") ? "" : scanCode(file.source);
    if (problem) flags.push(`${file.name}: ${problem}`);
    else passed.push(file.name);
  }
  if (!files.length) flags.push("No project files were found.");
  const blocking = flags.filter((item) => !item.includes("TEST_KEY_PLACEHOLDER"));
  const ready = files.length > 0 && blocking.length === 0;
  return {
    projectName,
    modules,
    notes,
    ready,
    github: process.env.GITHUB_TOKEN ? "saved" : "placeholder",
    testKey: process.env.TEST_KEY || "TEST_KEY_PLACEHOLDER",
    passed,
    flags,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const sample = "export function run() { return { ok: true }; }\n";
  console.log(JSON.stringify(verifyProject({ projectName: process.argv[2] || "Notes", files: [{ name: "app.ts", source: sample }] }), null, 2));
}
