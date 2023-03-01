const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument("appname", {
      type: String,
      required: true,
      description: "The Application Name"
    });

    this.argument("-t", {
      type: String,
      required: false,
      description: "testing"
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `${chalk.green(" ><(((º>")} \n Welcome to the badass ${chalk.red(
          "B.A.S.S."
        )} generator! \n ${chalk.green(" ><(((º>")} `
      )
    );

    this.log(`Creating Project: ${chalk.blue(this.options.appname)}`);

    const prompts = [
      {
        type: "input",
        name: "vfPageName",
        message: "VF Page Name",
        default: this.options.appname.replace(/\W/g, "")
      },
      {
        type: "input",
        name: "staticResourceName",
        message: "Static Resource Name",
        default: this.options.appname.replace(/\W/g, "")
      },
      {
        type: "input",
        name: "sfdxProjectRoot",
        message: "SFDX Project Root",
        default: "force-app"
      },
      {
        type: "input",
        name: "devUserName",
        message: 'Dev Username (for "deploy-dev" script)'
      },
      {
        type: "input",
        name: "prodUserName",
        message: `${chalk.red(
          "Production"
        )} Username (for "deploy-prod" script)`
      },
      {
        type: "confirm",
        name: "useTsForce",
        message: `Use ts-force?`,
        default: true
      },
      {
        type: "Number",
        name: "devServerPort",
        message: "Port for webpack dev server",
        default: 8080
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const templateProps = { ...this.props, appname: this.options.appname };

    const dynamic = path.join(".", "dynamic");

    this.destinationRoot(path.join(".", this.options.appname));

    this.fs.copy(
      this.templatePath(path.join(".", "static")),
      this.destinationPath("."),
      { globOptions: { dot: true } }
    );

    // SETUP TS-FORCE
    if (this.props.useTsForce) {
      this.fs.copyTpl(
        this.templatePath(path.join(dynamic, "config", "ts-force-config.json")),
        this.destinationPath(path.join("config", "ts-force-config.json")),
        templateProps
      );
    }

    this.fs.copyTpl(
      this.templatePath(path.join(dynamic, "app", "App.tsx")),
      this.destinationPath(path.join("app", "App.tsx")),
      templateProps
    );

    this.fs.copyTpl(
      this.templatePath(path.join(dynamic, "app", "index.tsx")),
      this.destinationPath(path.join("app", "index.tsx")),
      templateProps
    );

    this.fs.copyTpl(
      this.templatePath(path.join(dynamic, "package.json")),
      this.destinationPath("package.json"),
      templateProps
    );

    this.fs.copyTpl(
      this.templatePath(path.join(dynamic, "sfdx-project.json")),
      this.destinationPath("sfdx-project.json"),
      templateProps
    );

    this.fs.copyTpl(
      this.templatePath(path.join(dynamic, "dotgitignore")),
      this.destinationPath(".gitignore"),
      templateProps
    );

    this.fs.copyTpl(
      this.templatePath(path.join(dynamic, "dotnpmrc")),
      this.destinationPath(".npmrc"),
      templateProps
    );

    this.fs.copyTpl(
      this.templatePath(path.join(dynamic, ".vscode")),
      this.destinationPath(".vscode"),
      templateProps
    );

    const sfdxDefault = path.join("main", "default");
    const vfPageDir = path.join(sfdxDefault, "pages");
    const sourcePages = path.join(dynamic, "force-app", vfPageDir);
    const targetPages = path.join(templateProps.sfdxProjectRoot, vfPageDir);
    this.fs.copyTpl(
      this.templatePath(path.join(sourcePages, "App.page")),
      this.destinationPath(
        path.join(targetPages, `${templateProps.vfPageName}.page`)
      ),
      templateProps
    );

    this.fs.copyTpl(
      this.templatePath(path.join(sourcePages, "App.page-meta.xml")),
      this.destinationPath(
        path.join(targetPages, `${templateProps.vfPageName}.page-meta.xml`)
      ),
      templateProps
    );

    this.fs.copyTpl(
      this.templatePath(
        path.join(
          dynamic,
          "force-app",
          sfdxDefault,
          "staticresources",
          ".gitkeep"
        )
      ),
      this.destinationPath(
        path.join(
          templateProps.sfdxProjectRoot,
          sfdxDefault,
          "staticresources",
          ".gitkeep"
        )
      ),
      templateProps
    );

    this.fs.copy(
      this.templatePath(path.join(".", "static")),
      this.destinationPath("."),
      { globOptions: { dot: true } }
    );
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: true
    });
  }
};
