# @teachoco-dev/cli

A powerful CLI tool to create and manage project structure from YAML configuration files.

## Installation

```bash
npm install -g @teachoco-dev/cli
```

## Commands

### `init`

Initialize a new project with a configuration file.

```bash
tcc init
```

### `make`

Generate a `teachoco-dev.yaml` file from an existing folder structure.

```bash
# Scan current directory
tcc make

# Scan specific directory
tcc make ./path/to/project

# Custom output file
tcc make ./path/to/project -o output.yaml

# Custom workspace name
tcc make ./path/to/project -n my-app

# Custom run command
tcc make ./path/to/project -r "npm dev"
```

**Options:**
- `-o, --output <file>` - Output YAML or JSON file name (default: `teachoco-dev.yaml`)
- `-n, --name <name>` - Workspace name (default: `my-workspace`)
- `-r, --run <command>` - Run command (default: `npm start`)

### `render`

Render folder structure from YAML configuration file.

```bash
# Render all workspaces
tcc render ./path/to/config

# Render specific workspace
tcc render ./path/to/config -n my-app

# Force overwrite existing files
tcc render ./path/to/config -f

# Watch for changes
tcc render ./path/to/config -w
```

**Options:**
- `-w, --watch` - Watch for changes in the YAML file and re-render
- `-f, --force` - Force re-render even if files already exist
- `-n, --name <name>` - Render specific workspace by name

### `format`

Format code files in the project.

```bash
tcc format ./path/to/project
```

## Configuration

### teachoco-dev.yaml

```yaml
$schema: https://raw.githubusercontent.com/TeaChocoOfficial/cli/main/structure.schema.json
workspaces:
  - name: react-app
    run: npm start
    pack: {}
    src:
      - type: folder
        name: My Files
        children:
          - type: folder
            name: Documents
            children:
              - type: ts
                name: resume
                code:
                  - export default function resume() {
                  - '    return { name: "tea", age: 19 }'
                  - '}'
```

### tcc.config.json

```json
{
  "render": {
    "basePath": "./output",
    "structurePath": "./teachoco-dev.yaml",
    "watch": false
  }
}
```

## Features

- 📁 Generate project structure from YAML/JSON configuration
- 🔍 Scan existing directory and generate configuration
- 🔄 Watch mode for automatic re-rendering
- ⚡ Force mode to overwrite existing files
- 🎯 Support for multiple workspaces
- 📄 Support for TypeScript, TSX, and image files

## License

MIT

## Author

teachoco-official

## Repository

[GitHub](https://github.com/TeaChocoOfficial/cli)
