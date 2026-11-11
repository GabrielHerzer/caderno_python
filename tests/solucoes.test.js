"use strict";
// Roda cada solução de referência contra os próprios casos de teste, em Python de verdade,
// com a mesma comparação do corretor do site (src/core/python-worker.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { boot, global } = require("./helpers");

const python = ["python3", "python"].find((cmd) => !spawnSync(cmd, ["--version"]).error);

test(
  "todas as soluções de referência passam nos seus testes",
  { skip: !python && "Python não encontrado" },
  async () => {
    const w = await boot();
    const specs = global(w, "JSON.stringify(CODE_SPECS)");
    const run = spawnSync(python, ["-I", path.join(__dirname, "check_solutions.py")], {
      input: specs,
      encoding: "utf8",
    });
    assert.equal(run.status, 0, run.stdout + run.stderr);
  },
);
