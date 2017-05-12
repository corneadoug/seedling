#!/usr/bin/env node

/******************************
*           Includes          *
******************************/

const path = require("path");
const fs = require('fs-extra');
const clc = require("cli-color");
const exec = require("child_process").exec;
const loadJsonFile = require('load-json-file');
const lodash = require('lodash');

/******************************
*           Code              *
******************************/

loadJsonFile(path.join(process.cwd(), 'seedling.json'))
.then(function(seedlingConfig) {
    // TODO - Check for: no build-system folder || new npm version of build-system package

    // TODO check seedlingConfig
    exec('npm install ' + seedlingConfig.buildSystem.name + '@' + seedlingConfig.buildSystem.version,
        (error, stdout, stderr) => {
            if (error) {
                process.stdout.write(clc.red("Error while installing build-system package: \n" + error + "\n"));
            } else {
                loadJsonFile(path.join(process.cwd(), 'node_modules/' + seedlingConfig.buildSystem.name + '/package.json')).then(function(buildSystemPackageJson) {

                    seedlingConfig.scripts = lodash.merge(buildSystemPackageJson.scripts, seedlingConfig.scripts);
                    seedlingConfig.dependencies = lodash.merge(buildSystemPackageJson.dependencies, seedlingConfig.dependencies);
                    seedlingConfig.devDependencies = lodash.merge(buildSystemPackageJson.devDependencies, seedlingConfig.devDependencies);
                    delete seedlingConfig.buildSystem;
                    delete seedlingConfig.buildOptions;
                    process.stdout.write("Installing Dependencies...\n");
                    fs.writeJson(path.join(process.cwd(), 'package.json'), seedlingConfig).then(function(){
                        exec('npm install', (error, stdout, stderr) => {
                            if (error) {
                                process.stdout.write(clc.red("Error while installing dependencies: \n" + error + "\n"));
                            } else {
                                process.stdout.write("All done!\n");
                            }
                        });
                    }).catch(function(){
                        process.stdout.write(clc.red("Error: Could not create package.json file"));
                    });
                }).catch(function() {
                    process.stdout.write(clc.red("Error: No package.json file in " + seedlingConfig.buildSystem.name + "\n"));
                });
            }
    });

}).catch(function() {
    process.stdout.write(clc.red("No seedling.json or project folder found \n"));
});

