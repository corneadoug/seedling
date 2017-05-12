# Seedling

Seedling is a tool allowing to import the build system of a javascript project as a dependency.

## About

This project is an attempt to fix some issues related to the build system of a web project such as:

* Having to update the build system on multiple projects
* Using a seed project or generator, but being unable to benefit from its updates
* Having the source code and build system depending on each other too much.

Here is what we try to achieve:

* Fully separate the code from the build system, allowing to easily switch the build system anytime.
* Import the build system as a package, allowing to get updates easily when there is a new version


## Install
```
npm install -g seedling-js
```

## Requirement

To use Seedling in your project, you will need both a `seedling.json` file, and being able to download a package containing the build system.
(And of course a traditional `package.json`)

### seedling.json

A JSON config file with a few properties:

```
{
	"scripts": {},
	"devDependencies": {},
	"dependencies": {},
	"buildOptions": {},
    "buildSystem": {
        "name": "my-angular-webpack-build",
        "version": "^1.0.0"
    }
}
```

### Build System Package

The build system package is a simple package that can be downloaded through `npm`.

All paths needs to take into account the fact that this package will be in `node_modules` folder.

(So the root of the project will be located at `../../`)


#### Example

```
- .eslintignore
- .eslintrc.js
- karma.conf.js
- webpack.config.js
- package.json
```


## Usage

### Install dependencies and generate package.json file
* Run `seedling` inside your project.

### Build Project

* You will then be able to use any scripts defined in your build system as `npm run ...`

## How does it work?

We are making changes to the `package.json` file by merging the properties `scripts`, `devDependencies`, `dependencies` of your
build system `package.json` and the `seedling.json` of your project.

To add a new dependency, you will have to add it directly to the project's `seedling.json` and run `seedling` again to download new dependencies and re-create the package.json.


## Future features

* Injecting the build instructions in the Project README.md
* Provide some options to generate a `seedling.json` and new dependencies.
* Add proper documentation to change version after publish
* Add a list of build system packages
