//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as mocha from "mocha";
import * as fs from "fs";
import { InsertFileCommand } from "../src/InsertFile";

// Defines a Mocha test suite to group tests of similar kind together
mocha.setup("tdd");
suite("Extension Tests", () => {});
