# Tester

Sixth agent for Logically Done. Open this folder in Visual Studio Code or Visual Studio.

It scans the files already written for the active project. A clean structure is marked GREEN and Ready to Launch. A broken file is listed as a red flag. Missing keys stay `TEST_KEY_PLACEHOLDER` and do not stop the structural check.

The live page calls `/api/owner/logically-done/tester`. If `GITHUB_TOKEN` is missing, the report stays on the project and in the library.

```text
npm start -- "Notes"
```
